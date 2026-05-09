import React, { FC, useCallback, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { useChats } from 'Hooks/queries/useChats';
import { generatePresignedPutUrl, uploadImageToPresignedUrl } from 'Api/sharedspacesApi';
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
import { uuidv7 } from 'uuidv7';
import { useChatSocket } from 'Src/hooks/useChatSocket';
import { SocketStatus } from 'Src/constants/constants';
import { useAppSelector } from 'Src/hooks/reduxHooks';

const ChatContainer: FC = () => {
  const { url } = useParams();
  const qc = useQueryClient();
  const { data: userData } = useUser({ suspense: true, throwOnError: true });

  const { data: chatList, loadMore } = useChats();

  const scrollbarRef = useRef<HTMLUListElement>(null);
  const [ chat, onChangeChat, setChat ] = useInput('');
  const [ images, setImages ] = useState<File[]>([]);
  const [ previews, setPreviews ] = useState<string[]>([]);
  const { status: socketStatus } = useAppSelector(state => state.chatSocketStatus);

  const {
    sendSharedspaceChat,
    updateSharedspaceChat,
    deleteSharedspaceChat,
    showNewChat,
    setShowNewChat,
    canShowNotify,
  } = useChatSocket();

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

    const newImages: File[] = [];
    const newPreviews: string[] = [];

    for (const file of Array.from(e.target.files)) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(imageTooLargeMessage, {
          ...defaultToastOption,
          toastId: waitingMessage,
        });
        return;
      }

      newImages.push(file);
      newPreviews.push(URL.createObjectURL(file));
    }

    setImages(prev => [ ...prev, ...newImages ]);
    setPreviews(prev => [ ...prev, ...newPreviews ]);
  };

  const onSubmit = useCallback(async (content: string, images: File[], previews: string[]) => {
    if (socketStatus !== SocketStatus.CONNECTED) return;

    content = content.trim();

    if (!content && !images.length) {
      setChat('');
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

    scrollbarRef?.current?.scrollTo(0, 0);
    setChat('');
    setImages([]);
    setPreviews([]);

    if (images.length) {
      const presignedUrls = await generatePresignedPutUrl(url, metaDatas);

      const uploadPromises = presignedUrls.map((item, i) => uploadImageToPresignedUrl(item.presignedUrl, images[i], item.contentType));
      await Promise.all(uploadPromises);
    }

    sendSharedspaceChat(url, tempChatId, content, imageIds);
  }, [socketStatus]);

  return (
    <ChatBlock>
      <ChatWrapper>
        <ChatList
          chatList={chatList}
          previews={previews}
          scrollbarRef={scrollbarRef}
          showNewChat={showNewChat}
          setShowNewChat={setShowNewChat}
          canShowNotify={canShowNotify}
          updateSharedspaceChat={updateSharedspaceChat}
          deleteSharedspaceChat={deleteSharedspaceChat}
          loadMore={loadMore}
          onSubmit={onSubmit}
          deleteFile={deleteFile} />
        {
          userData ?
            <ChatFooter
              onSubmit={() => onSubmit(chat, images, previews)}
              socketStatus={socketStatus}
              chat={chat}
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