import { useQueryClient } from "@tanstack/react-query";
import { GET_SHAREDSPACE_CHATS_KEY } from "Constants/queryKeys";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import { ChatsCommandList, ChatStatus, TChatPayload, TChats } from "Typings/types";
import { useAppSelector } from "./reduxHooks";
import { ChatEmitEvent, SocketStatus } from "Src/constants/constants";

export function useChatSocket() {
  const { url: _url } = useParams();
  const qc = useQueryClient();
  const socketRef = useRef<Socket>();
  const canShowNotify = useRef(false);
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

  const sendSharedspaceChat = (
    url: string | undefined,
    id: string,
    content: string,
    imageIds: string[],
  ) => {
    socketRef.current?.emit(ChatEmitEvent.SEND_SHAREDSPACE_CHAT, { url, id, content, imageIds });
  };

  const updateSharedspaceChat = useCallback((
    url: string,
    ChatId: string,
    content: string,
  ) => {
    socketRef.current?.emit(ChatEmitEvent.UPDATE_SHAREDSPACE_CHAT, { url, ChatId, content });
  }, []);

  const onChatCreated = (data: TChatPayload) => {
    if (data.permission.isSender) {
      qc.setQueryData<TChats>([GET_SHAREDSPACE_CHATS_KEY, _url], (prev) => {
        const chats = prev?.chats.map(chat => {
          if (chat.id === data.id) {
            data.Images = data.Images.map((image, idx) => Object.assign(image, { _tempPath: chat.Images[idx]._tempPath }));
            return data;
          }
          return chat;
        });

        return {
          chats: chats || [],
          hasMoreData: prev?.hasMoreData || false,
        };
      });
    } else {
      qc.setQueryData<TChats>([GET_SHAREDSPACE_CHATS_KEY, _url], (prev) => {
        return {
          chats: [ data, ...prev?.chats || [] ],
          hasMoreData: prev?.hasMoreData || false,
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
        chats: chats || [],
        hasMoreData: prev.hasMoreData,
      };
    });
  };

  const onChatDeleted = (ChatId: string) => {
    qc.setQueryData<TChats>([GET_SHAREDSPACE_CHATS_KEY, _url], (prev) => {
      if (!prev) return;

      const idx = prev.chats.findIndex(chat => chat.id === ChatId);

      if (idx < 0) return;

      const head = prev.chats.slice(0, idx);
      const tail = prev.chats.slice(idx + 1, prev.chats.length);

      return {
        ...prev,
        chats: [ ...head, ...tail ],
      };
    });
  };

  const onChatImageDeleted = (ChatId: string, ImageId: string) => {
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
        ...prev,
        chats: [ ...head, { ...targetChat, Images: [ ...imagesHead, ...imagesTail ],  }, ...tail ],
      };
    });
  };

  const onChatError = (data: { action: string, ChatId: string }) => {
    const { action, ChatId } = data;

    if (action === `publicChats:${ChatsCommandList.CHAT_CREATED}`) {
      qc.setQueryData<TChats>([GET_SHAREDSPACE_CHATS_KEY, _url], (prev) => {
        const chats = prev?.chats.map(chat => {
          if (chat.id === ChatId) {
            return { ...chat, _status: ChatStatus.ERROR };
          }
          return chat;
        });

        return {
          chats: chats || [], 
          hasMoreData: prev?.hasMoreData || false,
        };
      });
      return;
    }
  };

  return {
    socketStatus,
    sendSharedspaceChat,
    updateSharedspaceChat,
    showNewChat,
    setShowNewChat,
    canShowNotify,
  } as const;
};