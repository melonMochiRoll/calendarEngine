import { InfiniteData, useQueryClient } from "@tanstack/react-query";
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

export function useChatSocket(queryKey: string, type: string) {
  const navigate = useNavigate();
  const { ChatRoomId: _ChatRoomId } = useParams();
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
    if (!_ChatRoomId || !socketRef.current) return;

    const socket = socketRef.current;

    socket.emit(ChatToServer.JOIN_ROOM, _ChatRoomId);
    socket.on(ChatToClient.CHAT_CREATED, onChatCreated);
    socket.on(ChatToClient.CHAT_UPDATED, onChatUpdated);
    socket.on(ChatToClient.CHAT_DELETED, onChatDeleted);
    socket.on(ChatToClient.CHAT_IMAGE_DELETED, onChatImageDeleted);
    socket.on(ChatToClient.CHAT_ERROR, onChatError);
    
    return () => {
      socket.emit(ChatToServer.LEAVE_ROOM, _ChatRoomId);
      socket.off(ChatToClient.CHAT_CREATED, onChatCreated);
      socket.off(ChatToClient.CHAT_UPDATED, onChatUpdated);
      socket.off(ChatToClient.CHAT_DELETED, onChatDeleted);
      socket.off(ChatToClient.CHAT_IMAGE_DELETED, onChatImageDeleted);
      socket.off(ChatToClient.CHAT_ERROR, onChatError);
    };
  }, [_ChatRoomId]);

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
        qc.setQueryData<InfiniteData<TChats>>([queryKey, _ChatRoomId], (prev) => {
          if (!prev) return;

          const pages = prev.pages.map(page => {
            const idx = page.chats.findIndex(chat => chat.id === ChatId);
            if (idx === -1) return page;

            const targetChat = page.chats[idx];
            const chats = [ ...page.chats ];

            chats[idx] = {
              ...targetChat,
              _status: ChatStatus.ERROR,
            };

            return {
              chats,
              hasMoreData: page.hasMoreData,
            };
          });

          return {
            pages,
            pageParams: prev.pageParams,
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
    ChatRoomId: string | undefined,
    content: string,
    images: File[],
    previews: string[]
  ) => {
    content = content.trim();

    if (!ChatRoomId || (!content && !images.length)) {
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

    qc.setQueryData<InfiniteData<TChats>>([queryKey, ChatRoomId], (prev) => {
      if (!prev) return;

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
          deleteErrorChat(ChatRoomId, tempChatId);
          sendSharedspaceChat(ChatRoomId, content, images, previews);
        },
        _clearAction: () => {
          deleteErrorChat(ChatRoomId, tempChatId);
          tempImages.forEach(image => URL.revokeObjectURL(image?._tempPath || ''));
        },
      };

      const pages = [ ...prev.pages ];
      pages[0].chats.unshift(tempChat);

      return {
        pages,
        pageParams: prev.pageParams,
      };
    });

    try {
      const payload = {
        ChatId: tempChatId,
        ChatRoomId,
        content,
        imageIds,
        imageKeys: [] as string[],
        type,
      };

      if (isTokenExpired()) {
        await refreshToken();
      }

      if (images.length) {
        const presignedUrls = await generatePresignedPutUrl(ChatRoomId, metaDatas);

        const imageKeys = presignedUrls.map(item => item.key);

        const uploadPromises = presignedUrls.map((item, i) => uploadImageToPresignedUrl(item.presignedUrl, images[i], item.contentType));
        await Promise.all(uploadPromises);

        payload.imageKeys = imageKeys;
      }

      emit(ChatToServer.SEND_CHAT, payload, tempChatId);
    } catch (err) {
      qc.setQueryData<InfiniteData<TChats>>([queryKey, _ChatRoomId], (prev) => {
        if (!prev) return;

        const pages = prev.pages.map(page => {
          const idx = page.chats.findIndex(chat => chat.id === tempChatId);
          if (idx === -1) return page;

          const targetChat = page.chats[idx];
          const chats = [ ...page.chats ];

          chats[idx] = {
            ...targetChat,
            _status: ChatStatus.ERROR,
          };

          return {
            chats,
            hasMoreData: page.hasMoreData,
          };
        });

        return {
          pages,
          pageParams: prev.pageParams,
        };
      });
    }
  };

  const updateSharedspaceChat = useCallback(async (
    ChatRoomId: string | undefined,
    id: string,
    oldContent: string,
    newContent: string,
  ) => {
    newContent = newContent.trim();

    if (
      oldContent === newContent ||
      !ChatRoomId ||
      !newContent
    ) {
      return;
    }

    qc.setQueryData<InfiniteData<TChats>>([queryKey, ChatRoomId], (prev) => {
      if (!prev) return;

      const pages = prev.pages.map(page => {
        const idx = page.chats.findIndex(chat => chat.id === id);
        if (idx === -1) return page;
        
        const targetChat = page.chats[idx];
        const chats = [ ...page.chats ];

        chats[idx] = {
          ...targetChat,
          content: newContent,
          _oldContent: oldContent,
          _status: ChatStatus.PENDING,
          _retryAction: () => {
            updateSharedspaceChat(ChatRoomId, id, oldContent, newContent);
          },
          _clearAction: () => {
            resetErrorChat(ChatRoomId, id);
          },
        };

        return {
          chats,
          hasMoreData: page.hasMoreData
        };
      });

      return {
        pages,
        pageParams: prev.pageParams,
      };
    });

    try {
      if (isTokenExpired()) {
        await refreshToken();
      }

      emit(ChatToServer.UPDATE_CHAT, { ChatRoomId, ChatId: id, content: newContent }, id);
    } catch (err) {
      qc.setQueryData<InfiniteData<TChats>>([queryKey, _ChatRoomId], (prev) => {
        if (!prev) return;

        const pages = prev.pages.map(page => {
          const idx = page.chats.findIndex(chat => chat.id === id);
          if (idx === -1) return page;

          const targetChat = page.chats[idx];
          const chats = [ ...page.chats ];

          chats[idx] = {
            ...targetChat,
            _status: ChatStatus.ERROR
          }
          
          return {
            ...page,
            chats,
          };
        });

        return {
          pages,
          pageParams: prev.pageParams,
        };
      });
    }
  }, []);

  const deleteSharedspaceChat = useCallback(async (
    ChatRoomId: string | undefined,
    id: string,
  ) => {
    if (!ChatRoomId) return;

    qc.setQueryData<InfiniteData<TChats>>([queryKey, ChatRoomId], (prev) => {
      if (!prev) return;

      const pages = prev.pages.map(page => {
        const idx = page.chats.findIndex(chat => chat.id === id);
        if (idx === -1) return page;

        const targetChat = page.chats[idx];
        const chats = [ ...page.chats ];
        chats[idx] = {
          ...targetChat,
          _status: ChatStatus.PENDING,
          _retryAction: () => {
            deleteSharedspaceChat(ChatRoomId, id);
          },
          _clearAction: () => {
            resetErrorChat(ChatRoomId, id);
          },
        };

        return {
          chats,
          hasMoreData: page.hasMoreData,
        };
      });

      return {
        pages,
        pageParams: prev.pageParams,
      };
    });

    try {
      if (isTokenExpired()) {
        await refreshToken();
      }

      emit(ChatToServer.DELETE_CHAT, { ChatRoomId, ChatId: id }, id);
    } catch (err) {
      qc.setQueryData<InfiniteData<TChats>>([queryKey, _ChatRoomId], (prev) => {
        if (!prev) return;

        const pages = prev.pages.map(page => {
          const idx = page.chats.findIndex(chat => chat.id === id);
          if (idx === -1) return page;

          const targetChat = page.chats[idx];
          const chats = [ ...page.chats ];

          chats[idx] = {
            ...targetChat,
            _status: ChatStatus.ERROR
          }
          
          return {
            ...page,
            chats,
          };
        });

        return {
          pages,
          pageParams: prev.pageParams,
        };
      });
    }
  }, []);

  const deleteSharedspaceChatImage = useCallback(async (
    ChatRoomId: string | undefined,
    ChatId: string,
    ImageId: string,
  ) => {
    if (!ChatRoomId) return;

    qc.setQueryData<InfiniteData<TChats>>([queryKey, ChatRoomId], (prev) => {
      if (!prev) return;

      const pages = prev.pages.map(page => {
        const idx = page.chats.findIndex(chat => chat.id === ChatId);
        if (idx === -1) return page;

        const targetChat = page.chats[idx];
        const chats = [ ...page.chats ];
        chats[idx] = {
          ...targetChat,
          _status: ChatStatus.PENDING,
          _retryAction: () => {
            deleteSharedspaceChatImage(ChatRoomId, ChatId, ImageId);
          },
          _clearAction: () => {
            resetErrorChat(ChatRoomId, ChatId);
          },
        };

        return {
          chats,
          hasMoreData: page.hasMoreData,
        };
      });

      return {
        pages,
        pageParams: prev.pageParams,
      };
    });

    try {
      if (isTokenExpired()) {
        await refreshToken();
      }

      emit(ChatToServer.DELETE_CHAT_IMAGE, { ChatRoomId, ChatId, ImageId }, ChatId);
    } catch (err) {
      qc.setQueryData<InfiniteData<TChats>>([queryKey, _ChatRoomId], (prev) => {
        if (!prev) return;

        const pages = prev.pages.map(page => {
          const idx = page.chats.findIndex(chat => chat.id === ChatId);
          if (idx === -1) return page;

          const targetChat = page.chats[idx];
          const chats = [ ...page.chats ];

          chats[idx] = {
            ...targetChat,
            _status: ChatStatus.ERROR
          }
          
          return {
            ...page,
            chats,
          };
        });

        return {
          pages,
          pageParams: prev.pageParams,
        };
      });
    }
  }, []);

  const onChatCreated = (data: TChatPayload) => {
    if (data.permission.isSender) {
      qc.setQueryData<InfiniteData<TChats>>([queryKey, _ChatRoomId], (prev) => {
        if (!prev) return;

        const pages = prev.pages.map(page => {
          const idx = page.chats.findIndex(chat => chat.id === data.id);
          if (idx === -1) return page;
          
          const targetChat = page.chats[idx];
          const chats = [ ...page.chats ];

          chats[idx] = {
            ...data,
            ChatImages: data.ChatImages.map((image, i) => Object.assign(image, { _tempPath: targetChat.ChatImages[i]._tempPath })),
          };

          return {
            chats,
            hasMoreData: page.hasMoreData,
          };
        });

        return {
          pages,
          pageParams: prev.pageParams,
        };
      });
    } else {
      qc.setQueryData<InfiniteData<TChats>>([queryKey, _ChatRoomId], (prev) => {
        if (!prev) return;

        const pages = [ ...prev.pages ];
        pages[0].chats.unshift(data);

        return {
          pages,
          pageParams: prev.pageParams,
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
    qc.setQueryData<InfiniteData<TChats>>([queryKey, _ChatRoomId], (prev) => {
      if (!prev) return;

      const pages = prev.pages.map(page => {
        const idx = page.chats.findIndex(chat => chat.id === data.id);
        if (idx === -1) return page;

        const { _status, _retryAction, _clearAction, ...rest } = page.chats[idx];
        const chats = [ ...page.chats ];

        chats[idx] = {
          ...rest,
          content: data.content,
          updatedAt: data.updatedAt,
        };

        return {
          chats,
          hasMoreData: page.hasMoreData,
        };
      });

      return {
        pages,
        pageParams: prev.pageParams,
      };
    });
  };

  const onChatDeleted = (data: Pick<TChatPayload, 'id'>) => {
    qc.setQueryData<InfiniteData<TChats>>([queryKey, _ChatRoomId], (prev) => {
      if (!prev) return;

      const pages = prev.pages.map(page => {
        const idx = page.chats.findIndex(chat => chat.id === data.id);
        if (idx === -1) return page;

        const head = page.chats.slice(0, idx);
        const tail = page.chats.slice(idx + 1, page.chats.length);

        return {
          chats: [ ...head, ...tail ],
          hasMoreData: page.hasMoreData,
        };
      });

      return {
        pages,
        pageParams: prev.pageParams,
      };
    });
  };

  const onChatImageDeleted = (data: { ChatId: string, ImageId: string }) => {
    const { ChatId, ImageId } = data;

    qc.setQueryData<InfiniteData<TChats>>([queryKey, _ChatRoomId], (prev) => {
      if (!prev) return;

      const pages = prev.pages.map(page => {
        const idx = page.chats.findIndex(chat => chat.id === ChatId);
        if (idx === -1) return page;

        const targetChat = page.chats[idx];
        const { _status, _retryAction, _clearAction, ...rest } = targetChat;
        const chats = [ ...page.chats ];

        const imageIdx = targetChat.ChatImages.findIndex(image => image.id === ImageId);
        const imagesHead = targetChat.ChatImages.slice(0, imageIdx);
        const imagesTail = targetChat.ChatImages.slice(imageIdx + 1, targetChat.ChatImages.length);
        
        chats[idx] = {
          ...rest,
          ChatImages: [ ...imagesHead, ...imagesTail ],
        };

        return {
          chats,
          hasMoreData: page.hasMoreData,
        };
      });

      return {
        pages,
        pageParams: prev.pageParams,
      };
    });
  };

  const onChatError = async (data: { type: TErrorType, ChatId: string }) => {
    const { type, ChatId } = data;

    if (type === ERROR_TYPE.UNAUTHORIZED_ERROR) {
      await logout();
      qc.removeQueries({ queryKey: [GET_USER_KEY] });
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
      const data = qc.getQueryData<TChats>([queryKey, _ChatRoomId]);
      
      if (data) {
        const chatIdx = data.chats.findIndex(chat => chat.id === ChatId);

        if (chatIdx >= 0 && data.chats[chatIdx]._clearAction) {
          toast.error(waitingMessage, defaultToastOption);
        }
      }
    }

    qc.setQueryData<InfiniteData<TChats>>([queryKey, _ChatRoomId], (prev) => {
      if (!prev) return;
      
      const pages = prev.pages.map(page => {
        const idx = page.chats.findIndex(chat => chat.id === ChatId);
        if (idx === -1) return page;

        const targetChat = page.chats[idx];
        const chats = [ ...page.chats ];

        chats[idx] = {
          ...targetChat,
          _status: ChatStatus.ERROR,
          content: targetChat?._oldContent || targetChat.content,
        };

        return {
          chats,
          hasMoreData: page.hasMoreData,
        };
      });

      return {
        pages,
        pageParams: prev.pageParams,
      };
    });
  };

  const deleteErrorChat = (ChatRoomId: string | undefined, ChatId: string) => {
    qc.setQueryData<InfiniteData<TChats>>([queryKey, ChatRoomId], (prev) => {
      if (!prev) return;

      const pages = prev.pages.map(page => {
        const idx = page.chats.findIndex(chat => chat.id === ChatId);
        if (idx === -1) return page;

        const head = page.chats.slice(0, idx);
        const tail = page.chats.slice(idx + 1, page.chats.length);

        return {
          chats: [ ...head, ...tail ],
          hasMoreData: page.hasMoreData,
        };
      });

      return {
        pages,
        pageParams: prev.pageParams,
      };
    });
  };

  const resetErrorChat = (ChatRoomId: string | undefined, ChatId: string) => {
    qc.setQueryData<InfiniteData<TChats>>([queryKey, ChatRoomId], (prev) => {
      if (!prev) return;
      
      const pages = prev.pages.map(page => {
        const idx = page.chats.findIndex(chat => chat.id === ChatId);
        if (idx === -1) return page;

        const targetChat = page.chats[idx];
        const { _status, ...rest } = targetChat;
        const chats = [ ...page.chats ];

        chats[idx] = {
          ...rest,
          content: targetChat?._oldContent || targetChat.content,
        };

        return {
          chats,
          hasMoreData: page.hasMoreData,
        };
      });

      return {
        pages,
        pageParams: prev.pageParams,
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