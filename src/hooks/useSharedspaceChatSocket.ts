import { useQueryClient } from "@tanstack/react-query";
import { GET_SHAREDSPACE_CHATS_KEY } from "Constants/queryKeys";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { ChatStatus, TChatPayload, TChats } from "Typings/types";
import { ChatAckStatus, ChatToClient, ChatToServer, SocketStatus } from "Src/constants/constants";
import { toast } from "react-toastify";
import { defaultToastOption, waitingMessage } from "Src/constants/notices";
import dayjs from 'dayjs';
import { uuidv7 } from 'uuidv7';
import { generatePresignedPutUrl, uploadImageToPresignedUrl } from 'Api/sharedspacesApi';
import useUser from "./queries/useUser";
import { useSocket } from "./useSocket";

export function useSharedspaceChatSocket() {
  const { url: _url } = useParams();
  const qc = useQueryClient();
  const { socketRef } = useSocket();
  const canShowNotify = useRef(false);
  const { data: userData } = useUser({ suspense: true, throwOnError: true });
  const [ showNewChat, setShowNewChat ] = useState<{ chat: string, email: string, nickname: string, profileImage: string } | null>(null);
  const [ socketStatus, setSocketStatus ] = useState(SocketStatus.CONNECTING);
  
  useEffect(() => {
    if (!_url) return;

    const socket = socketRef.current;

    socket?.on('connect', () => setSocketStatus(SocketStatus.CONNECTED));
    socket?.on('disconnect', () => setSocketStatus(SocketStatus.DISCONNECTED));
    socket?.io.on('reconnect_attempt', () => setSocketStatus(SocketStatus.RECONNECTING));
    socket?.io.on('reconnect', () => setSocketStatus(SocketStatus.CONNECTED));

    socket?.on(ChatToClient.SHAREDSPACE_CHAT_CREATED, onChatCreated);
    socket?.on(ChatToClient.SHAREDSPACE_CHAT_UPDATED, onChatUpdated);
    socket?.on(ChatToClient.SHAREDSPACE_CHAT_DELETED, onChatDeleted);
    socket?.on(ChatToClient.SHAREDSPACE_CHAT_IMAGE_DELETED, onChatImageDeleted);

    socket?.emit(ChatToServer.SHAREDSPACE_JOIN_ROOM, _url);

    return () => {
      socket?.emit(ChatToServer.SHAREDSPACE_LEAVE_ROOM, _url);
      socket?.disconnect();
    };
  }, [_url]);

  const sendSharedspaceChat = async (
    url: string | undefined,
    content: string,
    images: File[],
    previews: string[]
  ) => {
    if (socketStatus !== SocketStatus.CONNECTED) return;

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
      const presignedUrls = await generatePresignedPutUrl(url, metaDatas);

      const uploadPromises = presignedUrls.map((item, i) => uploadImageToPresignedUrl(item.presignedUrl, images[i], item.contentType));
      await Promise.all(uploadPromises);
    }

    try {
      const response: { status: string, data: TChatPayload | null } = await socketRef.current
        ?.timeout(4000)
        .emitWithAck(ChatToServer.SHAREDSPACE_SEND_CHAT, { url, id: tempChatId, content, imageIds });

      if (response.status !== ChatAckStatus.SUCCESS || !response.data) {
        throw new Error();
      }

      const { data } = response;

      qc.setQueryData<TChats>([GET_SHAREDSPACE_CHATS_KEY, _url], (prev) => {
        if (!prev) return;

        const chats = prev.chats.map(chat => {
          if (chat.id === data.id) {
            return {
              ...data,
              Images: data.Images.map((image, idx) => Object.assign(image, { _tempPath: chat.Images[idx]._tempPath })),
            };
          }
          return chat;
        });

        return {
          chats,
          hasMoreData: prev.hasMoreData,
        };
      });
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
    if (socketStatus !== SocketStatus.CONNECTED) return;
    
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

    try {
      const response: { status: string, data: Pick<TChatPayload, 'id' | 'content' | 'updatedAt'> | null } = await socketRef.current
        ?.timeout(4000)
        .emitWithAck(ChatToServer.SHAREDSPACE_UPDATE_CHAT, { url, id, content: newContent });

      if (response.status !== ChatAckStatus.SUCCESS || !response.data) {
        throw new Error();
      }

      const { data } = response;

      qc.setQueryData<TChats>([GET_SHAREDSPACE_CHATS_KEY, _url], (prev) => {
        if (!prev) return;

        const chats = prev.chats.map((chat) => {
          if (chat.id === data.id) {
            return {
              ...chat,
              content: data.content,
              updatedAt: data.updatedAt,
              _status: ChatStatus.SUCCESS,
            };
          }
          return chat;
        });

        return {
          chats,
          hasMoreData: prev.hasMoreData,
        };
      });
    } catch (err) {
      qc.setQueryData<TChats>([GET_SHAREDSPACE_CHATS_KEY, _url], (prev) => {
        if (!prev) return;

        const chats = prev.chats.map(chat => {
          if (chat.id === id) {
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
    }
  }, [socketStatus]);

  const deleteSharedspaceChat = useCallback(async (
    url: string | undefined,
    id: string,
  ) => {
    if (
      socketStatus !== SocketStatus.CONNECTED ||
      !url
    ) {
      return;
    };

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

    try {
      const response: { status: string, data: Pick<TChatPayload, 'id'> | null } = await socketRef.current
        ?.timeout(4000)
        .emitWithAck(ChatToServer.SHAREDSPACE_DELETE_CHAT, { url, id });

      if (response.status !== ChatAckStatus.SUCCESS || !response.data) {
        throw new Error();
      }

      const { data } = response;

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
    } catch (err) {
      qc.setQueryData<TChats>([GET_SHAREDSPACE_CHATS_KEY, _url], (prev) => {
        if (!prev) return;

        const chats = prev.chats.map(chat => {
          if (chat.id === id) {
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
    }
  }, [socketStatus]);

  const deleteSharedspaceChatImage = useCallback(async (
    url: string | undefined,
    ChatId: string,
    ImageId: string,
  ) => {
    if (socketStatus !== SocketStatus.CONNECTED || !url) return;

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

    try {
      const response: {
        status: string,
        data: { action: typeof ChatToClient.SHAREDSPACE_CHAT_DELETED, id: string } |
          { action: typeof ChatToClient.SHAREDSPACE_CHAT_IMAGE_DELETED, ChatId: string, ImageId: string } | null
      } = await socketRef.current
        ?.timeout(4000)
        .emitWithAck(ChatToServer.SHAREDSPACE_DELETE_CHAT_IMAGE, { url, ChatId, ImageId });

      if (response.status !== ChatAckStatus.SUCCESS || !response.data) {
        throw new Error();
      }

      const { data } = response;

      if (data.action === ChatToClient.SHAREDSPACE_CHAT_DELETED) {
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
      }

      if (data.action === ChatToClient.SHAREDSPACE_CHAT_IMAGE_DELETED) {
        qc.setQueryData<TChats>([GET_SHAREDSPACE_CHATS_KEY, _url], (prev) => {
          if (!prev) return;
          
          const chatIdx = prev.chats.findIndex(chat => chat.id === data.ChatId);
          const head = prev.chats.slice(0, chatIdx);
          const tail = prev.chats.slice(chatIdx + 1, prev.chats.length);

          const targetChat = prev.chats[chatIdx];
          const imageIdx = targetChat.Images.findIndex(image => image.id === data.ImageId);
          const imagesHead = targetChat.Images.slice(0, imageIdx);
          const imagesTail = targetChat.Images.slice(imageIdx + 1, targetChat.Images.length);

          return {
            chats: [ ...head, { ...targetChat, Images: [ ...imagesHead, ...imagesTail ],  }, ...tail ],
            hasMoreData: prev.hasMoreData,
          };
        });
      }

      throw new Error();
    } catch (err) {
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
    }
  }, [socketStatus]);

  const onChatCreated = (data: TChatPayload) => {
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