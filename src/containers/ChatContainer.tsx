import React, { FC, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { useChatSocket } from 'Hooks/useChatSocket';
import { useChats } from 'Hooks/queries/useChats';
import { createSharedspaceChat } from 'Api/sharedspacesApi';
import { useParams } from 'react-router-dom';
import useInput from 'Hooks/utils/useInput';
import { throttle } from 'lodash';
import { toast } from 'react-toastify';
import { defaultToastOption, imageTooLargeMessage, tooManyImagesMessage, waitingMessage } from 'Constants/notices';
import ChatFooter from 'Components/chat/ChatFooter';
import ChatList from 'Components/chat/ChatList';

const ChatContainer: FC = () => {
  const { url } = useParams();

  const { data: chatList, loadMore } = useChats();
  const {
    showNewChat,
    setShowNewChat,
  } = useChatSocket();

  const scrollbarRef = useRef<HTMLUListElement>(null);
  const [ chat, onChangeChat, setChat ] = useInput('');
  const [ images, setImages ] = useState<File[]>([]);
  const [ previews, setPreviews ] = useState<Array<string | ArrayBuffer | null>>([]);

  const onScroll = throttle(() => {
    if (scrollbarRef.current) {
      const isTop = scrollbarRef.current.scrollHeight - 100 < scrollbarRef.current.clientHeight - scrollbarRef.current.scrollTop;

      if (isTop && chatList.hasMoreData) {
        loadMore();
        scrollbarRef?.current?.scrollTo(0, -200);
      }

      const newChatNoticeBorder = (0 - scrollbarRef.current.scrollTop) > scrollbarRef.current.clientHeight / 2;
      if (newChatNoticeBorder) {
        setShowNewChat({ active: true, chat: '', email: '', profileImage: '', });
      }

      const isBottom = scrollbarRef.current.scrollTop > -100;
      if (isBottom) {
        setShowNewChat({ active: false, chat: '', email: '', profileImage: '', });
      }
    }
  }, 300);

  const deleteFile = (idx: number) => {
    setImages(prev => [ ...prev.slice(0, idx), ...prev.slice(idx + 1, prev.length) ]);
    setPreviews(prev => [ ...prev.slice(0, idx), ...prev.slice(idx + 1, prev.length) ]);
  };

  const onChangeImageFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (!e.target.files) return;

    if (images.length > 5) {
      toast.info(tooManyImagesMessage, {
        ...defaultToastOption,
      });
      return;
    }

    const newImages =
      Object
      .values(e.target.files)
      .map((file) => {
        const reader = new FileReader();

        reader.onloadend = () => {
          setPreviews(prev => [ ...prev, reader.result ]);
        };
        reader.readAsDataURL(file);

        return file;
      });

    setImages(prev => [ ...prev, ...newImages ]);
  };

  const onSubmit = () => {
    const trimmedChat = chat.trim();

    if (!trimmedChat && !images.length) {
      setChat('');
      return;
    }

    const formData = new FormData();

    formData.append('content', trimmedChat);
    images.forEach((image) => {
      formData.append('images', image);
    });

    createSharedspaceChat(url, formData)
      .then(() => {
        scrollbarRef?.current?.scrollTo(0, 0);
        setChat('');
        setImages([]);
        setPreviews([]);
      })
      .catch((error) => {
        const errorMessage = error?.response?.status === 413 ?
          imageTooLargeMessage :
          waitingMessage;

        toast.error(errorMessage, {
          ...defaultToastOption,
          toastId: errorMessage,
        });
      });
  };

  return (
    <ChatBlock>
      <ChatWrapper>
        <ChatList
          chatList={chatList}
          previews={previews}
          showNewChat={showNewChat}
          scrollbarRef={scrollbarRef}
          onScroll={onScroll}
          deleteFile={deleteFile} />
        <ChatFooter
          onSubmit={onSubmit}
          chat={chat}
          onChangeChat={onChangeChat}
          onChangeImageFiles={onChangeImageFiles} />
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