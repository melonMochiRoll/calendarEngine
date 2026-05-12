import { useQueryClient } from "@tanstack/react-query";
import { GET_SHAREDSPACE_CHATS_KEY } from "Constants/queryKeys";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import { ChatStatus, TChatPayload, TChats } from "Typings/types";
import { useAppSelector } from "./reduxHooks";
import { ChatEmitEvent, ChatsCommandList, SocketStatus } from "Src/constants/constants";
import { toast } from "react-toastify";
import { defaultToastOption, waitingMessage } from "Src/constants/notices";
import dayjs from 'dayjs';
import { uuidv7 } from 'uuidv7';
import { generatePresignedPutUrl, uploadImageToPresignedUrl } from 'Api/sharedspacesApi';
import useUser from "./queries/useUser";

export function useChatSocket() {
  const { url: _url } = useParams();
  const qc = useQueryClient();
  const socketRef = useRef<Socket>();
  const canShowNotify = useRef(false);
  const { data: userData } = useUser({ suspense: true, throwOnError: true });
  const [ showNewChat, setShowNewChat ] = useState<{ chat: string, email: string, nickname: string, profileImage: string } | null>(null);
  const [ socketStatus, setSocketStatus ] = useState(SocketStatus.CONNECTING);
  const { token } = useAppSelector(state => state.csrfToken);
  
  useEffect(() => {
    if (!_url || !token) return;

    socketRef.current = io(
      `${process.env.REACT_APP_SERVER_ORIGIN}/sharedspace-${_url}`,
      {
        withCredentials: true,
        auth: {
          'x-csrf-token': token,
        },
      },
    );

    const socket = socketRef.current;

    socket?.on('connect', () => setSocketStatus(SocketStatus.CONNECTED));
    socket?.on('disconnect', () => setSocketStatus(SocketStatus.DISCONNECTED));
    socket?.io.on('reconnect_attempt', () => setSocketStatus(SocketStatus.RECONNECTING));
    socket?.io.on('reconnect', () => setSocketStatus(SocketStatus.CONNECTED));

    socket?.on(`publicChats:${ChatsCommandList.CHAT_CREATED}`, onChatCreated);
    socket?.on(`publicChats:${ChatsCommandList.CHAT_UPDATED}`, onChatUpdated);
    socket?.on(`publicChats:${ChatsCommandList.CHAT_DELETED}`, onChatDeleted);
    socket?.on(`publicChats:${ChatsCommandList.CHAT_IMAGE_DELETED}`, onChatImageDeleted);
    socket?.on(`publicChats:${ChatsCommandList.CHAT_ERROR}`, onChatError);

    return () => {
      socket?.disconnect();
    };
  }, [_url, token]);

  const sendSharedspaceChat = async (
    content: string,
    images: File[],
    previews: string[]
  ) => {
    if (socketStatus !== SocketStatus.CONNECTED) return false;

    content = content.trim();

    if (!content && !images.length) {
      return false;
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

    qc.setQueryData<TChats>([GET_SHAREDSPACE_CHATS_KEY, _url], (prev) => {
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
          profileImage: userData.profileImage,
        },
        Images: tempImages,
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

    if (images.length) {
      const presignedUrls = await generatePresignedPutUrl(_url, metaDatas);

      const uploadPromises = presignedUrls.map((item, i) => uploadImageToPresignedUrl(item.presignedUrl, images[i], item.contentType));
      await Promise.all(uploadPromises);
    }


    socketRef.current?.emit(ChatEmitEvent.SEND_SHAREDSPACE_CHAT, { _url, id: tempChatId, content, imageIds });
    return true;
  };

  const updateSharedspaceChat = useCallback((
    url: string | undefined,
    id: string,
    oldContent: string,
    newContent: string,
  ) => {
    if (socketStatus !== SocketStatus.CONNECTED) return;
    
    newContent = newContent.trim();

    if (
      oldContent === newContent ||
      !url ||
      !newContent
    ) {
      return;
    }

    qc.setQueryData<TChats>([GET_SHAREDSPACE_CHATS_KEY, _url], (prev) => {
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

    socketRef.current?.emit(ChatEmitEvent.UPDATE_SHAREDSPACE_CHAT, { url, id, content: newContent });
  }, [socketStatus]);

  const deleteSharedspaceChat = useCallback((
    url: string | undefined,
    id: string,
  ) => {
    if (
      socketStatus !== SocketStatus.CONNECTED ||
      !url
    ) {
      return;
    };

    qc.setQueryData<TChats>([GET_SHAREDSPACE_CHATS_KEY, _url], (prev) => {
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

    socketRef.current?.emit(ChatEmitEvent.DELETE_SHAREDSPACE_CHAT, { url, id });
  }, [socketStatus]);

  const deleteSharedspaceChatImage = useCallback((
    url: string | undefined,
    ChatId: string,
    ImageId: string,
  ) => {
    if (socketStatus !== SocketStatus.CONNECTED || !url) return;

    qc.setQueryData<TChats>([GET_SHAREDSPACE_CHATS_KEY, _url], (prev) => {
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

    socketRef.current?.emit(ChatEmitEvent.DELETE_SHAREDSPACE_CHAT_IMAGE, { url, ChatId, ImageId });
  }, [socketStatus]);

  const onChatCreated = (data: TChatPayload) => {
    if (data.permission.isSender) {
      qc.setQueryData<TChats>([GET_SHAREDSPACE_CHATS_KEY, _url], (prev) => {
        if (!prev) return;

        const chats = prev.chats.map(chat => {
          if (chat.id === data.id) {
            data.Images = data.Images.map((image, idx) => Object.assign(image, { _tempPath: chat.Images[idx]._tempPath }));
            return data;
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

      if (canShowNotify.current) {
        setShowNewChat({
          chat: data.content,
          email: data.Sender.email,
          nickname: data.Sender.nickname,
          profileImage: data.Sender.profileImage,
        });
      }
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
      const imageIdx = targetChat.Images.findIndex(image => image.id === ImageId);
      const imagesHead = targetChat.Images.slice(0, imageIdx);
      const imagesTail = targetChat.Images.slice(imageIdx + 1, targetChat.Images.length);

      return {
        chats: [ ...head, { ...targetChat, Images: [ ...imagesHead, ...imagesTail ],  }, ...tail ],
        hasMoreData: prev.hasMoreData,
      };
    });
  };

  const onChatError = (data: { action: string, ChatId: string }) => {
    const { action, ChatId } = data;

    if (action === `publicChats:${ChatsCommandList.CHAT_CREATED}`) {
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

    if (
      action === `publicChats:${ChatsCommandList.CHAT_UPDATED}` ||
      action === `publicChats:${ChatsCommandList.CHAT_DELETED}` ||
      action === `publicChats:${ChatsCommandList.CHAT_IMAGE_DELETED}`
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