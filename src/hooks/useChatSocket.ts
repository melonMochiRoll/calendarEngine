import { useQueryClient } from "@tanstack/react-query";
import { GET_SHAREDSPACE_CHATS_KEY, GET_USER_KEY } from "Constants/queryKeys";
import { getOrigin } from "Lib/utilFunction";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import { ChatsCommandList, TChatPayload, TChats, TUser } from "Typings/types";

export function useChatSocket() {
  const { url: _url } = useParams();
  const qc = useQueryClient();
  const socketRef = useRef<Socket>();
  const userData = qc.getQueryData<TUser>([GET_USER_KEY]);
  const [ showNewChat, setShowNewChat ] = useState({
    active: false,
    chat: '',
    email: '',
    profileImage: '',
  });

  useEffect(() => {
    socketRef.current = io(`${getOrigin()}/sharedspace-${_url}`);
    const socket = socketRef.current;

    socket?.on(`publicChats:${ChatsCommandList.CHAT_CREATED}`, onChatCreated);
    socket?.on(`publicChats:${ChatsCommandList.CHAT_UPDATED}`, onChatUpdated);
    socket?.on(`publicChats:${ChatsCommandList.CHAT_DELETED}`, onChatDeleted);
    socket?.on(`publicChats:${ChatsCommandList.CHAT_IMAGE_DELETED}`, onChatImageDeleted);

    return () => {
      socket?.disconnect();
    };
  }, [_url]);

  const onChatCreated = (data: Omit<TChatPayload, 'permission'>) => {
    qc.setQueryData<TChats>([GET_SHAREDSPACE_CHATS_KEY, _url], (prev) => {
      const withPermission = Object.assign(data, {
        permission: {
          isSender: data.SenderId === userData?.id,
        }
      });

      if (!prev) {
        return { chats: [ withPermission ], hasMoreData: false };
      }

      return {
        chats: [ withPermission, ...prev.chats ],
        hasMoreData: prev.hasMoreData,
      };
    });

    setShowNewChat({
      chat: data.content,
      active: false,
      email: data.Sender.email,
      profileImage: data.Sender.profileImage,
    });
  };

  const onChatUpdated = (data: Omit<TChatPayload, 'permission'>) => {
    qc.setQueryData<TChats>([GET_SHAREDSPACE_CHATS_KEY, _url], (prev) => {
      if (prev) {
        const withPermission = Object.assign(data, {
          permission: {
            isSender: data.SenderId === userData?.id,
          },
        });
        const newChats = [ ...prev.chats ];
        const idx = newChats.findIndex(chat => chat.id === data.id);

        if (idx < 0) return;

        newChats[idx] = withPermission;
        return {
          chats: newChats,
          hasMoreData: prev.hasMoreData,
        };
      }
    });
  };

  const onChatDeleted = (ChatId: number) => {
    qc.setQueryData<TChats>([GET_SHAREDSPACE_CHATS_KEY, _url], (prev) => {
      if (prev) {
        const idx = prev.chats.findIndex(chat => chat.id === ChatId);

        if (idx < 0) return;

        const head = prev.chats.slice(0, idx);
        const tail = prev.chats.slice(idx + 1, prev.chats.length);

        return {
          chats: [ ...head, ...tail ],
          hasMoreData: prev.hasMoreData,
        };
      }
    });
  };

  const onChatImageDeleted = (ChatId: number, ImageId: number) => {
    qc.setQueryData([GET_SHAREDSPACE_CHATS_KEY, _url], (prev?: TChats) => {
      if (prev) {
        const chatIdx = prev.chats.findIndex(chat => chat.id === ChatId);
        const head = prev.chats.slice(0, chatIdx);
        const tail = prev.chats.slice(chatIdx + 1, prev.chats.length);

        const targetChat = prev.chats[chatIdx];
        const imageIdx = targetChat.Images.findIndex(image => image.id === ImageId);
        const imagesHead = targetChat.Images.slice(0, imageIdx);
        const imagesTail = targetChat.Images.slice(imageIdx + 1, targetChat.Images.length);

        return {
          chats: [ ...head, { ...targetChat, Images: [ ...imagesHead, ...imagesTail ],  }, ...tail ],
          hasMoreData: prev.hasMoreData
        };
      }
    });
  };

  return {
    socket: socketRef.current,
    showNewChat,
    setShowNewChat,
    onChatCreated,
    onChatUpdated,
    onChatDeleted,
    onChatImageDeleted,
  } as const;
};