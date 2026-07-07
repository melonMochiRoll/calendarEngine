import { useQueryClient } from "@tanstack/react-query";
import { GET_USER_KEY } from "Constants/queryKeys";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChatStatus, TChatPayload, TChats, TChatToServer, TErrorType } from "Typings/types";
import { ChatToClient, ChatToServer, ERROR_TYPE } from "Src/constants/constants";
import dayjs from 'dayjs';
import { uuidv7 } from 'uuidv7';
import { uploadImageToPresignedUrl } from 'Api/sharedspacesApi';
import useUser from "./queries/useUser";
import { useSocket } from "./useSocket";
import { PATHS } from "Src/constants/paths";
import { logout } from "Src/api/authApi";
import { toast } from "react-toastify";
import { defaultToastOption, needLogin, waitingMessage } from "Src/constants/notices";
import { generatePresignedPutUrl } from "Src/api/chatsApi";

export function useSpaceChatSocket(queryKey: string) {
  const navigate = useNavigate();
  const { url: _url } = useParams();
  const qc = useQueryClient();
  const {
    socketRef,
    refreshToken,
    isTokenExpired,
    pendingMessages,
  } = useSocket();
  const canShowNotify = useRef(false);
  const { data: userData } = useUser();
  const [ showNewChat, setShowNewChat ] = useState<{ chat: string, email: string, nickname: string, profileImage: string } | null>(null);

  useEffect(() => {
    if (!_url || !socketRef.current) return;

    const socket = socketRef.current;

    socket.emit(ChatToServer.JOIN_ROOM, _url);
    socket.on(ChatToClient.CHAT_CREATED, onChatCreated);
    socket.on(ChatToClient.CHAT_UPDATED, onChatUpdated);
    socket.on(ChatToClient.CHAT_DELETED, onChatDeleted);
    socket.on(ChatToClient.CHAT_IMAGE_DELETED, onChatImageDeleted);
    socket.on(ChatToClient.CHAT_ERROR, onChatError);
    
    return () => {
      socket.emit(ChatToServer.LEAVE_ROOM, _url);
      socket.off(ChatToClient.CHAT_CREATED, onChatCreated);
      socket.off(ChatToClient.CHAT_UPDATED, onChatUpdated);
      socket.off(ChatToClient.CHAT_DELETED, onChatDeleted);
      socket.off(ChatToClient.CHAT_IMAGE_DELETED, onChatImageDeleted);
      socket.off(ChatToClient.CHAT_ERROR, onChatError);
    };
  }, [_url]);

  const emit = async (
    event: TChatToServer,
    data: any,
    ChatId: string,
    retryCount = 0,
  ) => {
    const socket = socketRef.current;

    if (!socket) return;
  
    const default_Delay = 3000;

    const timer = setTimeout(() => {
      const pending = pendingMessages.current.get(ChatId);
      if (!pending) return;

      if (pending.retryCount > 3) {
        qc.setQueryData<TChats>([queryKey, _url], (prev) => {
          if (!prev) return;

          const chats = prev?.chats.map(chat => {
            if (chat.id === ChatId) {
              return { ...chat, _status: ChatStatus.ERROR };
            }
            return chat;
          });

          return {
            chats,
            hasMoreData: prev.hasMoreData,
          };
        });
        pendingMessages.current.delete(ChatId);
        return;
      }

      pendingMessages.current.delete(ChatId);

      const delay = 1000 * Math.pow(2, pending.retryCount);

      setTimeout(() => {
        emit(event, data, ChatId, pending.retryCount + 1);
      }, delay);
    }, default_Delay);

    pendingMessages.current.set(ChatId, {
      event,
      data,
      timer,
      retryCount,
    });

    socket.emit(event, data);
  };

  const sendSharedspaceChat = async (
    url: string | undefined,
    content: string,
    images: File[],
    previews: string[]
  ) => {
    content = content.trim();

    if (!url || (!content && !images.length)) {
      return;
    }

    const tempChatId = uuidv7();

    const imageIds: string[] = [];
    const tempImages: Array<{ id: string, path: string, _tempPath: string }> = [];
    const metaDatas: Array<{ id: string, fileName: string, fileSize: number, contentType: string }> = [];

    for (let i=0; i<images.length; i++) {
      const id = uuidv7();
      const image = images[i];

      imageIds.push(id);
      tempImages.push({ id, path: '', _tempPath: previews[i] });
      metaDatas.push({ id, fileName: image.name, fileSize: image.size, contentType: image.type });
    }

    qc.setQueryData<TChats>([queryKey, url], (prev) => {
      const now = dayjs().toISOString();

      const tempChat = {
        id: tempChatId,
        content,
        SenderId: userData.id,
        createdAt: now,
        updatedAt: now,
        Sender: {
          email: userData.email,
          nickname: userData.nickname,
          ProfileImage: userData.ProfileImage,
        },
        ChatImages: tempImages,
        permission: {
          isSender: true,
        },
        _status: ChatStatus.PENDING,
        _imageFiles: images,
        _retryAction: () => {
          deleteErrorChat(url, tempChatId);
          sendSharedspaceChat(url, content, images, previews);
        },
        _clearAction: () => {
          deleteErrorChat(url, tempChatId);
          tempImages.forEach(image => URL.revokeObjectURL(image?._tempPath || ''));
        },
      };

      return {
        chats: [ tempChat, ...prev?.chats || [] ],
        hasMoreData: prev?.hasMoreData || false,
      };
    });

    try {
      const payload = {
        ChatId: tempChatId,
        url,
        content,
        imageIds,
        imageKeys: [] as string[],
      };

      if (isTokenExpired()) {
        await refreshToken();
      }

      if (images.length) {
        const presignedUrls = await generatePresignedPutUrl(url, metaDatas);

        const imageKeys = presignedUrls.map(item => item.key);

        const uploadPromises = presignedUrls.map((item, i) => uploadImageToPresignedUrl(item.presignedUrl, images[i], item.contentType));
        await Promise.all(uploadPromises);

        payload.imageKeys = imageKeys;
      }

      emit(ChatToServer.SEND_CHAT, payload, tempChatId);
    } catch (err) {
      qc.setQueryData<TChats>([queryKey, _url], (prev) => {
        if (!prev) return;

        const chats = prev?.chats.map(chat => {
          if (chat.id === tempChatId) {
            return { ...chat, _status: ChatStatus.ERROR };
          }
          return chat;
        });

        return {
          chats,
          hasMoreData: prev.hasMoreData,
        };
      });
    }
  };

  const updateSharedspaceChat = useCallback(async (
    url: string | undefined,
    id: string,
    oldContent: string,
    newContent: string,
  ) => {
    newContent = newContent.trim();

    if (
      oldContent === newContent ||
      !url ||
      !newContent
    ) {
      return;
    }

    qc.setQueryData<TChats>([queryKey, url], (prev) => {
      if (!prev) return;

      const chats = prev.chats.map((chat) => {
        if (chat.id === id) {
          return {
            ...chat,
            content: newContent,
            _oldContent: oldContent,
            _status: ChatStatus.PENDING,
            _retryAction: () => {
              updateSharedspaceChat(url, id, oldContent, newContent);
            },
            _clearAction: () => {
              resetErrorChat(url, id);
            },
          };
        }
        return chat;
      });

      return {
        chats,
        hasMoreData: prev.hasMoreData,
      };
    });

    try {
      if (isTokenExpired()) {
        await refreshToken();
      }

      emit(ChatToServer.UPDATE_CHAT, { url, ChatId: id, content: newContent }, id);
    } catch (err) {
      qc.setQueryData<TChats>([queryKey, _url], (prev) => {
        if (!prev) return;

        const chats = prev?.chats.map(chat => {
          if (chat.id === id) {
            return { ...chat, _status: ChatStatus.ERROR };
          }
          return chat;
        });

        return {
          chats,
          hasMoreData: prev.hasMoreData,
        };
      });
    }
  }, []);

  const deleteSharedspaceChat = useCallback(async (
    url: string | undefined,
    id: string,
  ) => {
    if (!url) return;

    qc.setQueryData<TChats>([queryKey, url], (prev) => {
      if (!prev) return;

      const chats = prev.chats.map((chat) => {
        if (chat.id === id) {
          return {
            ...chat,
            _status: ChatStatus.PENDING,
            _retryAction: () => {
              deleteSharedspaceChat(url, id);
            },
            _clearAction: () => {
              resetErrorChat(url, id);
            },
          };
        }
        return chat;
      });

      return {
        chats,
        hasMoreData: prev.hasMoreData,
      };
    });

    try {
      if (isTokenExpired()) {
        await refreshToken();
      }

      emit(ChatToServer.DELETE_CHAT, { url, ChatId: id }, id);
    } catch (err) {
      qc.setQueryData<TChats>([queryKey, _url], (prev) => {
        if (!prev) return;

        const chats = prev?.chats.map(chat => {
          if (chat.id === id) {
            return { ...chat, _status: ChatStatus.ERROR };
          }
          return chat;
        });

        return {
          chats,
          hasMoreData: prev.hasMoreData,
        };
      });
    }
  }, []);

  const deleteSharedspaceChatImage = useCallback(async (
    url: string | undefined,
    ChatId: string,
    ImageId: string,
  ) => {
    if (!url) return;

    qc.setQueryData<TChats>([queryKey, url], (prev) => {
      if (!prev) return;

      const chats = prev.chats.map((chat) => {
        if (chat.id === ChatId) {
          return {
            ...chat,
            _status: ChatStatus.PENDING,
            _retryAction: () => {
              deleteSharedspaceChatImage(url, ChatId, ImageId);
            },
            _clearAction: () => {
              resetErrorChat(url, ChatId);
            },
          };
        }
        return chat;
      });

      return {
        chats,
        hasMoreData: prev.hasMoreData,
      };
    });

    try {
      if (isTokenExpired()) {
        await refreshToken();
      }

      emit(ChatToServer.DELETE_CHAT_IMAGE, { url, ChatId, ImageId }, ChatId);
    } catch (err) {
      qc.setQueryData<TChats>([queryKey, _url], (prev) => {
        if (!prev) return;

        const chats = prev?.chats.map(chat => {
          if (chat.id === ChatId) {
            return { ...chat, _status: ChatStatus.ERROR };
          }
          return chat;
        });

        return {
          chats,
          hasMoreData: prev.hasMoreData,
        };
      });
    }
  }, []);

  const onChatCreated = (data: TChatPayload) => {
    if (data.permission.isSender) {
      qc.setQueryData<TChats>([queryKey, _url], (prev) => {
        if (!prev) return;

        const chats = prev.chats.map(chat => {
          if (chat.id === data.id) {
            return {
              ...data,
              ChatImages: data.ChatImages.map((image, idx) => Object.assign(image, { _tempPath: chat.ChatImages[idx]._tempPath })),
            };
          }
          return chat;
        });

        return {
          chats,
          hasMoreData: prev.hasMoreData,
        };
      });
    } else {
      qc.setQueryData<TChats>([queryKey, _url], (prev) => {
        if (!prev) return;

        return {
          chats: [ data, ...prev.chats ],
          hasMoreData: prev.hasMoreData,
        };
      });
    }

    if (canShowNotify.current) {
      setShowNewChat({
        chat: data.content,
        email: data.Sender.email,
        nickname: data.Sender.nickname,
        profileImage: data.Sender.ProfileImage,
      });
    }
  };

  const onChatUpdated = (data: Pick<TChatPayload, 'id' | 'content' | 'updatedAt' | 'permission'>) => {
    qc.setQueryData<TChats>([queryKey, _url], (prev) => {
      if (!prev) return;

      const chats = prev.chats.map((chat) => {
        if (chat.id === data.id) {
          const { _status, _retryAction, _clearAction, ...rest } = chat;

          return {
            ...rest,
            content: data.content,
            updatedAt: data.updatedAt,
          };
        }
        return chat;
      });

      return {
        chats,
        hasMoreData: prev.hasMoreData,
      };
    });
  };

  const onChatDeleted = (data: Pick<TChatPayload, 'id'>) => {
    qc.setQueryData<TChats>([queryKey, _url], (prev) => {
      if (!prev) return;

      const idx = prev.chats.findIndex(chat => chat.id === data.id);

      if (idx < 0) return;

      const head = prev.chats.slice(0, idx);
      const tail = prev.chats.slice(idx + 1, prev.chats.length);

      return {
        chats: [ ...head, ...tail ],
        hasMoreData: prev.hasMoreData,
      };
    });
  };

  const onChatImageDeleted = (data: { ChatId: string, ImageId: string }) => {
    const { ChatId, ImageId } = data;

    qc.setQueryData<TChats>([queryKey, _url], (prev) => {
      if (!prev) return;

      const chats = prev.chats.map(chat => {
        if (chat.id === ChatId) {
          const { _status, _retryAction, _clearAction, ...rest } = chat;

          const imageIdx = chat.ChatImages.findIndex(image => image.id === ImageId);
          const imagesHead = chat.ChatImages.slice(0, imageIdx);
          const imagesTail = chat.ChatImages.slice(imageIdx + 1, chat.ChatImages.length);

          return {
            ...rest,
            ChatImages: [ ...imagesHead, ...imagesTail ],
          };
        }
        return chat;
      });

      return {
        chats,
        hasMoreData: prev.hasMoreData,
      };
    });
  };

  const onChatError = async (data: { type: TErrorType, ChatId: string }) => {
    const { type, ChatId } = data;

    if (type === ERROR_TYPE.UNAUTHORIZED_ERROR) {
      await logout();
      qc.removeQueries([GET_USER_KEY]);
      toast.error(needLogin, defaultToastOption);
      return navigate(PATHS.LOGIN, { replace: true });
    }

    if (type === ERROR_TYPE.AUTH_TOKEN_EXPIRED) {
      try {
        await refreshToken();
      } catch (err) {
        return navigate(PATHS.LOGIN, { replace: true });
      }
    }

    if (type === ERROR_TYPE.BAD_REQUEST_ERROR) {
      const data = qc.getQueryData<TChats>([queryKey, _url]);
      
      if (data) {
        const chatIdx = data.chats.findIndex(chat => chat.id === ChatId);

        if (chatIdx >= 0 && data.chats[chatIdx]._clearAction) {
          toast.error(waitingMessage, defaultToastOption);
        }
      }
    }

    qc.setQueryData<TChats>([queryKey, _url], (prev) => {
      if (!prev) return;

      const chats = prev?.chats.map(chat => {
        if (chat.id === ChatId) {
          return {
            ...chat,
            _status: ChatStatus.ERROR,
            content: chat?._oldContent || chat.content,
          };
        }
        return chat;
      });

      return {
        chats,
        hasMoreData: prev.hasMoreData,
      };
    });
  };

  const deleteErrorChat = (url: string | undefined, ChatId: string) => {
    qc.setQueryData<TChats>([queryKey, url], (prev) => {
      if (!prev) return;

      const idx = prev.chats.findIndex(chat => chat.id === ChatId);

      if (idx < 0) return;

      const rest = [ ...prev.chats.slice(0, idx), ...prev.chats.slice(idx + 1, prev.chats.length) ];

      return {
        ...prev,
        chats: rest || [], 
      };
    });
  };

  const resetErrorChat = (url: string | undefined, ChatId: string) => {
    qc.setQueryData<TChats>([queryKey, url], (prev) => {
      if (!prev) return;

      const chats = prev.chats.map(chat => {
        if (chat.id === ChatId) {
          const { _status, ...rest } = chat;
          return {
            ...rest,
            content: chat?._oldContent || chat.content,
          };
        }
        return chat;
      });

      return {
        chats,
        hasMoreData: prev.hasMoreData,
      };
    });
  };

  return {
    sendSharedspaceChat,
    updateSharedspaceChat,
    deleteSharedspaceChat,
    deleteSharedspaceChatImage,
    showNewChat,
    setShowNewChat,
    canShowNotify,
  } as const;
};