import React, { FC, useRef, useState } from 'react';
import styled from '@emotion/styled';
import useSocket from 'Hooks/useSocket';
import { TChats } from 'Typings/types';
import useChats from 'Hooks/useChats';
import { createSharedspaceChat, getSharedspaceChats } from 'Api/sharedspacesApi';
import { useParams } from 'react-router-dom';
import useInput from 'Hooks/useInput';
import { useQueryClient } from '@tanstack/react-query';
import { GET_SHAREDSPACE_CHATS_KEY } from 'Constants/queryKeys';
import { throttle } from 'lodash';
import { toast } from 'react-toastify';
import { defaultToastOption, tooManyImagesMessage } from 'Constants/notices';
import ChatFooter from 'Components/chat/ChatFooter';
import ChatList from 'Components/chat/ChatList';

const ChatContainer: FC = () => {
  const { url } = useParams();
  const qc = useQueryClient();

  const { showNewChat, setShowNewChat } = useSocket();
  const { data: chatList, offset, setOffset } = useChats({ suspense: true, throwOnError: true });

  const scrollbarRef = useRef<HTMLUListElement>(null);
  const [ chat, onChangeChat, setChat ] = useInput('');
  const [ images, setImages ] = useState<File[]>([]);
  const [ previews, setPreviews ] = useState<Array<string | ArrayBuffer | null>>([]);

  const loadMore = () => {
    scrollbarRef?.current?.scrollTo(0, -200);
        
    getSharedspaceChats(url, offset + 1)
      .then((res) => {
        qc.setQueryData([GET_SHAREDSPACE_CHATS_KEY], (prev?: TChats) => {
          if (prev) {
            return { chats: [ ...prev?.chats, ...res.chats ], hasMoreData: res?.hasMoreData };
          }
        });
        setOffset(prev => prev + 1);
      })
      .catch(() => {
        qc.invalidateQueries([GET_SHAREDSPACE_CHATS_KEY]);
      });
  };

  const onScroll = throttle(() => {
    if (scrollbarRef.current) {
      const isTop = scrollbarRef.current.scrollHeight - 100 < scrollbarRef.current.clientHeight - scrollbarRef.current.scrollTop;

      if (isTop && chatList.hasMoreData) {
        loadMore();
      }

      const newChatNoticeBorder = (0 - scrollbarRef.current.scrollTop) > scrollbarRef.current.clientHeight / 2;
      if (newChatNoticeBorder) {
        setShowNewChat(prev => { return { ...prev, active: true }});
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

    const result = Object.values(e.target.files).map((file) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        setPreviews(prev => [ ...prev, reader.result ]);
      };

      reader.readAsDataURL(file);

      return file;
    });

    setImages(prev => [ ...prev, ...result ]);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
      })
      .catch((errorMessage) => {
        toast.error(errorMessage, {
          ...defaultToastOption,
        });
      })
      .finally(() => {
        setChat('');
        setImages([]);
        setPreviews([]);
      });
  };

  return (
    <Block>
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
    </Block>
  );
};

export default ChatContainer;

const Block = styled.section`
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