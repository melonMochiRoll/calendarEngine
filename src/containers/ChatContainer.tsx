import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { useChats } from 'Hooks/queries/useChats';
import { createSharedspaceChat, generatePresignedPutUrl, uploadImageToPresignedUrl } from 'Api/sharedspacesApi';
import { useParams } from 'react-router-dom';
import useInput from 'Hooks/utils/useInput';
import { toast } from 'react-toastify';
import { defaultToastOption, imageTooLargeMessage, tooManyImagesMessage, waitingMessage } from 'Constants/notices';
import ChatFooter from 'Components/chat/ChatFooter';
import ChatList from 'Components/chat/ChatList';
import ChatDisableFooter from 'Src/components/chat/ChatDisableFooter';
import useUser from 'Src/hooks/queries/useUser';
import { useQueryClient } from '@tanstack/react-query';
import { ChatStatus, TChats } from 'Src/typings/types';
import { GET_SHAREDSPACE_CHATS_KEY } from 'Src/constants/queryKeys';
import dayjs from 'dayjs';

const ChatContainer: FC = () => {
  const { url } = useParams();
  const qc = useQueryClient();
  const { data: userData } = useUser({ suspense: true, throwOnError: true });

  const { data: chatList, loadMore } = useChats();

  const scrollbarRef = useRef<HTMLUListElement>(null);
  const [ chat, onChangeChat, setChat ] = useInput('');
  const [ images, setImages ] = useState<File[]>([]);
  const [ previews, setPreviews ] = useState<string[]>([]);

  useEffect(() => {
    return () => {
      previews.forEach(preview => URL.revokeObjectURL(preview));
    };
  }, [previews]);

  const deleteFile = useCallback((idx: number) => {
    setImages(prev => [ ...prev.slice(0, idx), ...prev.slice(idx + 1, prev.length) ]);
    setPreviews(prev => {
      URL.revokeObjectURL(prev[idx]);
      return [ ...prev.slice(0, idx), ...prev.slice(idx + 1, prev.length) ];
    });
  }, []);

  const onChangeImageFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (!e.target.files) return;

    if (images.length + e.target.files.length > 6) {
      toast.info(tooManyImagesMessage, {
        ...defaultToastOption,
      });
      return;
    }

    const newImages = Array.from(e.target.files);
    const newPreviews: string[] = [];

    for (const file of newImages) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(imageTooLargeMessage, {
          ...defaultToastOption,
          toastId: waitingMessage,
        });
        return;
      }

      newPreviews.push(URL.createObjectURL(file));
    }

    setImages(prev => [ ...prev, ...newImages ]);
    setPreviews(prev => [ ...prev, ...newPreviews ]);
  };

  const onSubmit = useCallback(async (chat: string, images: File[], previews: string[]) => {
    const trimmedChat = chat.trim();
    const imageKeys = [];

    if (!trimmedChat && !images.length) {
      setChat('');
      return;
    }

    scrollbarRef?.current?.scrollTo(0, 0);
    setChat('');
    setImages([]);
    setPreviews([]);

    const tempId = -Date.now();

    qc.setQueryData<TChats>([GET_SHAREDSPACE_CHATS_KEY, url], (prev) => {
      const now = dayjs().toISOString();
      const Images = images.length ? previews.map((url, idx) => {return { id: -idx, path: url }}) : [];

      const tempChat = {
        id: tempId,
        content: trimmedChat,
        SenderId: userData.id,
        createdAt: now,
        updatedAt: now,
        Sender: {
          email: userData.email,
          nickname: userData.nickname,
          profileImage: userData.profileImage,
        },
        Images,
        permission: {
          isSender: true,
        },
        _status: ChatStatus.PENDING,
      };

      return {
        chats: [ tempChat, ...prev?.chats || [] ],
        hasMoreData: prev?.hasMoreData || false,
      };
    });

    try {
      if (images.length) {
        const metaDatas = images.map(image => {
          return { fileName: image.name, fileSize: image.size, contentType: image.type };
        });

        const presignedUrls = await generatePresignedPutUrl(url, metaDatas);

        const uploadPromises = presignedUrls.map((item, i) => uploadImageToPresignedUrl(item.presignedUrl, images[i], item.contentType));
        await Promise.all(uploadPromises);

        for (const { key } of presignedUrls) {
          imageKeys.push(key);
        }
      }

      const success = await createSharedspaceChat(url, trimmedChat, imageKeys);

      qc.setQueryData<TChats>([GET_SHAREDSPACE_CHATS_KEY, url], (prev) => {
        const chats = prev?.chats.map(chat => {
          if (chat.id === tempId) {
            chat.Images.forEach(image => URL.revokeObjectURL(image.path));
            return success;
          }
          return chat;
        });

        return {
          chats: chats || [], 
          hasMoreData: prev?.hasMoreData || false,
        };
      });
    } catch (err) {
      qc.setQueryData<TChats>([GET_SHAREDSPACE_CHATS_KEY, url], (prev) => {
        const chats = prev?.chats.map(chat => {
          if (chat.id === tempId) {
            return { ...chat, _status: ChatStatus.ERROR, _imageFiles: [ ...images ] };
          }
          return chat;
        });

        return {
          chats: chats || [], 
          hasMoreData: prev?.hasMoreData || false,
        };
      });
    }
  }, []);

  return (
    <ChatBlock>
      <ChatWrapper>
        <ChatList
          chatList={chatList}
          previews={previews}
          scrollbarRef={scrollbarRef}
          loadMore={loadMore}
          onSubmit={onSubmit}
          deleteFile={deleteFile} />
        {
          userData ?
            <ChatFooter
              onSubmit={onSubmit}
              chat={chat}
              images={images}
              previews={previews}
              onChangeChat={onChangeChat}
              onChangeImageFiles={onChangeImageFiles} />
              :
              <ChatDisableFooter />
        }
      </ChatWrapper>
    </ChatBlock>
  );
};

export default ChatContainer;

const ChatBlock = styled.div`
  display: flex;
  justify-content: center;
  width: 70%;
`;

const ChatWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 1000px;
  height: 100%;
  background-color: var(--dark-gray);
`;