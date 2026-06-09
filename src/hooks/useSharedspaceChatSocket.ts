import { useQueryClient } from "@tanstack/react-query";
import { GET_SHAREDSPACE_CHATS_KEY } from "Constants/queryKeys";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { ChatStatus, TChatPayload, TChats } from "Typings/types";
import { ChatToClient, ChatToServer } from "Src/constants/constants";
import { toast } from "react-toastify";
import { defaultToastOption, waitingMessage } from "Src/constants/notices";
import dayjs from 'dayjs';
import { uuidv7 } from 'uuidv7';
import { generatePresignedPutUrl, uploadImageToPresignedUrl } from 'Api/sharedspacesApi';
import useUser from "./queries/useUser";
import { useSocket } from "./useSocket";
import { useAppSelector } from "./reduxHooks";

export function useSharedspaceChatSocket() {
  const { url: _url } = useParams();
  const qc = useQueryClient();
  const {
    socketRef,
    refreshToken,
    isTokenExpired,
    eventQueue,
  } = useSocket();
  const canShowNotify = useRef(false);
  const { data: userData } = useUser({ suspense: true, throwOnError: true });
  const [ showNewChat, setShowNewChat ] = useState<{ chat: string, email: string, nickname: string, profileImage: string } | null>(null);
  const { socketStatus } = useAppSelector(state => state.socketStatus);
  const isSocketReady = useRef(false);

  useEffect(() => {
    if (!_url || !socketRef.current) return;

    const socket = socketRef.current;

    socket.emit(ChatToServer.JOIN_ROOM, _url);
    socket.on(ChatToClient.READY, () => isSocketReady.current = true);
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

  const sendSharedspaceChat = async (
    url: string | undefined,
    content: string,
    images: File[],
    previews: string[]
  ) => {
    if (!socketRef.current || !url) return;

    content = content.trim();

    if (!content && !images.length) {
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

    qc.setQueryData<TChats>([GET_SHAREDSPACE_CHATS_KEY, url], (prev) => {
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
      };

      return {
        chats: [ tempChat, ...prev?.chats || [] ],
        hasMoreData: prev?.hasMoreData || false,
      };
    });

    try {
      if (images.length) {
        const presignedUrls = await generatePresignedPutUrl(url, metaDatas);

        const uploadPromises = presignedUrls.map((item, i) => uploadImageToPresignedUrl(item.presignedUrl, images[i], item.contentType));
        await Promise.all(uploadPromises);
      }

      if (isTokenExpired()) {
        await refreshToken();
        socketRef.current.emit(ChatToServer.JOIN_ROOM, url);
      }

      if (isSocketReady.current) {
        socketRef.current.emit(ChatToServer.SEND_CHAT, { url, ChatId: tempChatId, content, imageIds });
      } else {
        eventQueue.current.push({ event: ChatToServer.SEND_CHAT, data: { url, ChatId: tempChatId, content, imageIds } });
      }
    } catch (err) {
      qc.setQueryData<TChats>([GET_SHAREDSPACE_CHATS_KEY, _url], (prev) => {
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
    if (!socketRef.current) return;

    newContent = newContent.trim();

    if (
      oldContent === newContent ||
      !url ||
      !newContent
    ) {
      return;
    }

    qc.setQueryData<TChats>([GET_SHAREDSPACE_CHATS_KEY, url], (prev) => {
      if (!prev) return;

      const chats = prev.chats.map((chat) => {
        if (chat.id === id) {
          return {
            ...chat,
            content: newContent,
            _oldContent: oldContent,
            _status: ChatStatus.PENDING,
          };
        }
        return chat;
      });

      return {
        chats,
        hasMoreData: prev.hasMoreData,
      };
    });

    if (isTokenExpired()) {
      await refreshToken();
      socketRef.current.emit(ChatToServer.JOIN_ROOM, url);
    }

    if (isSocketReady.current) {
      socketRef.current.emit(ChatToServer.UPDATE_CHAT, { url, ChatId: id, content: newContent });
    } else {
      eventQueue.current.push({ event: ChatToServer.UPDATE_CHAT, data: { url, ChatId: id, content: newContent } });
    }
  }, []);

  const deleteSharedspaceChat = useCallback(async (
    url: string | undefined,
    id: string,
  ) => {
    if (!socketRef.current || !url) return;

    qc.setQueryData<TChats>([GET_SHAREDSPACE_CHATS_KEY, url], (prev) => {
      if (!prev) return;

      const chats = prev.chats.map((chat) => {
        if (chat.id === id) {
          return {
            ...chat,
            _status: ChatStatus.PENDING,
          };
        }
        return chat;
      });

      return {
        chats,
        hasMoreData: prev.hasMoreData,
      };
    });

    if (isTokenExpired()) {
      await refreshToken();
      socketRef.current.emit(ChatToServer.JOIN_ROOM, url);
    }

    if (isSocketReady.current) {
      socketRef.current.emit(ChatToServer.DELETE_CHAT, { url, ChatId: id });
    } else {
      eventQueue.current.push({ event: ChatToServer.DELETE_CHAT, data: { url, ChatId: id } });
    }
  }, []);

  const deleteSharedspaceChatImage = useCallback(async (
    url: string | undefined,
    ChatId: string,
    ImageId: string,
  ) => {
    if (!socketRef.current || !url) return;
    const socket = socketRef.current;

    qc.setQueryData<TChats>([GET_SHAREDSPACE_CHATS_KEY, url], (prev) => {
      if (!prev) return;

      const chats = prev.chats.map((chat) => {
        if (chat.id === ChatId) {
          return {
            ...chat,
            _status: ChatStatus.PENDING,
          };
        }
        return chat;
      });

      return {
        chats,
        hasMoreData: prev.hasMoreData,
      };
    });

    if (isTokenExpired()) {
      await refreshToken();
      socketRef.current.emit(ChatToServer.JOIN_ROOM, url);
    }

    if (isSocketReady.current) {
      socket.emit(ChatToServer.DELETE_CHAT_IMAGE, { url, ChatId, ImageId });
    } else {
      eventQueue.current.push({ event: ChatToServer.DELETE_CHAT_IMAGE, data: { url, ChatId, ImageId } });
    }
  }, []);

  const onChatCreated = (data: TChatPayload) => {
    if (data.permission.isSender) {
      qc.setQueryData<TChats>([GET_SHAREDSPACE_CHATS_KEY, _url], (prev) => {
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
      qc.setQueryData<TChats>([GET_SHAREDSPACE_CHATS_KEY, _url], (prev) => {
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
    qc.setQueryData<TChats>([GET_SHAREDSPACE_CHATS_KEY, _url], (prev) => {
      if (!prev) return;

      const chats = prev.chats.map((chat) => {
        if (chat.id === data.id) {
          const { _status, ...rest } = chat;

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
    qc.setQueryData<TChats>([GET_SHAREDSPACE_CHATS_KEY, _url], (prev) => {
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

    qc.setQueryData<TChats>([GET_SHAREDSPACE_CHATS_KEY, _url], (prev) => {
      if (!prev) return;
      
      const chatIdx = prev.chats.findIndex(chat => chat.id === ChatId);
      const head = prev.chats.slice(0, chatIdx);
      const tail = prev.chats.slice(chatIdx + 1, prev.chats.length);

      const targetChat = prev.chats[chatIdx];
      const imageIdx = targetChat.ChatImages.findIndex(image => image.id === ImageId);
      const imagesHead = targetChat.ChatImages.slice(0, imageIdx);
      const imagesTail = targetChat.ChatImages.slice(imageIdx + 1, targetChat.ChatImages.length);

      return {
        chats: [ ...head, { ...targetChat, Images: [ ...imagesHead, ...imagesTail ],  }, ...tail ],
        hasMoreData: prev.hasMoreData,
      };
    });
  };

  const onChatError = (data: { event: string, ChatId: string }) => {
    const { event, ChatId } = data;

    if (event === ChatToServer.SEND_CHAT) {
      qc.setQueryData<TChats>([GET_SHAREDSPACE_CHATS_KEY, _url], (prev) => {
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
      return;
    }

    if (event === ChatToServer.UPDATE_CHAT) {
      qc.setQueryData<TChats>([GET_SHAREDSPACE_CHATS_KEY, _url], (prev) => {
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
      toast.error(waitingMessage, defaultToastOption);
      return;
    }

    if (
      event === ChatToServer.DELETE_CHAT,
      event === ChatToServer.DELETE_CHAT_IMAGE
    ) {
      qc.setQueryData<TChats>([GET_SHAREDSPACE_CHATS_KEY, _url], (prev) => {
        if (!prev) return;

        const chats = prev.chats.map(chat => {
          if (chat.id === ChatId) {
            const { _status, ...rest } = chat;
            return rest;
          }
          return chat;
        });

        return {
          chats,
          hasMoreData: prev.hasMoreData,
        };
      });
      toast.error(waitingMessage, defaultToastOption);
      return;
    }
  };

  return {
    socketStatus,
    sendSharedspaceChat,
    updateSharedspaceChat,
    deleteSharedspaceChat,
    deleteSharedspaceChatImage,
    showNewChat,
    setShowNewChat,
    canShowNotify,
  } as const;
};