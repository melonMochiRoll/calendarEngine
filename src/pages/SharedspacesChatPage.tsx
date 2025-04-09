import React, { FC, Fragment, useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import useSocket from 'Hooks/useSocket';
import SendIcon from '@mui/icons-material/Send';
import Chat from 'Components/chat/Chat';
import { ChatsCommandList, TChatList, TChats } from 'Typings/types';
import DateSeparator from 'Components/chat/DateSeparator';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import useChats from 'Hooks/useChats';
import SkeletonChatList from 'Components/skeleton/SkeletonChatList';
import { createSharedspaceChats, getSharedspaceChats } from 'Api/sharedspacesApi';
import { useParams } from 'react-router-dom';
import useInput from 'Hooks/useInput';
import { useQueryClient } from '@tanstack/react-query';
import { GET_SHAREDSPACE_CHATS_KEY } from 'Lib/queryKeys';
import { throttle } from 'lodash';
import NewChatNotifier from 'Components/chat/NewChatNotifier';
import AddCircleIcon from '@mui/icons-material/AddCircleRounded';
import useMenu from 'Hooks/useMenu';
import { Menu, MenuItem } from '@mui/material';
import AddPhotoIcon from '@mui/icons-material/AddPhotoAlternate';
import ImagePreviewer from 'Components/chat/ImagePreviewer';
import { toast } from 'react-toastify';
import { defaultToastOption, imageTooLargeMessage, muiMenuDefaultSx, tooManyImagesMessage, waitingMessage } from 'Lib/noticeConstants';
import { formatDate } from 'Lib/utilFunction';

const SharedspacesChatPage: FC = () => {
  const { url } = useParams();
  const qc = useQueryClient();
  const { socket } = useSocket();
  const { data: chatList, isLoading, offset, setOffset } = useChats();
  dayjs.extend(utc);
  dayjs.extend(timezone);
  const localTimeZone = dayjs.tz.guess();

  const [ chat, onChangeChat, setChat ] = useInput('');
  const [ files, setFiles ] = useState<File[]>([]);
  const [ previews, setPreviews ] = useState<Array<string | ArrayBuffer | null>>([]);

  const scrollbarRef = useRef<HTMLUListElement>(null);
  const [ showNewChat, setShowNewChat ] = useState({
    chat: '',
    active: false,
    email: '',
    profileImage: '',
  });

  const {
    anchorEl,
    open,
    onOpen,
    onClose,
  } = useMenu();

  const onScroll = throttle(() => {
    if (scrollbarRef.current) {
      const isTop = scrollbarRef.current.scrollHeight - 100 < scrollbarRef.current.clientHeight - scrollbarRef.current.scrollTop;

      if (isTop && chatList.hasMoreData) {
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
      }

      if (scrollbarRef.current.scrollTop > -100) {
        setShowNewChat({ chat: '', active: false, email: '', profileImage: '', });
      }
    }
  }, 300);

  const deleteFile = (idx: number) => {
    setFiles(prev => [ ...prev.slice(0, idx), ...prev.slice(idx + 1, prev.length) ]);
    setPreviews(prev => [ ...prev.slice(0, idx), ...prev.slice(idx + 1, prev.length) ]);
  };
    
  const onChatCreated = (data: TChatList) => {
    qc.setQueryData([GET_SHAREDSPACE_CHATS_KEY], (prev?: TChats) => {
      if (!prev || !Array.isArray(prev.chats)) {
        return { chats: [ data ], hasMoreData: prev?.hasMoreData || false };
      }

      return { chats: [ data, ...prev?.chats ], hasMoreData: prev?.hasMoreData };
    });

    if (scrollbarRef.current) {
      const scrollBorder = (0 - scrollbarRef.current.scrollTop) > scrollbarRef.current.clientHeight / 2;
    
      if (scrollBorder) {
        setShowNewChat({
          chat: data.content,
          active: true,
          email: data.Sender.email,
          profileImage: data.Sender.profileImage,
        });
      }
    }
  };

  const onChatUpdated = (data: TChatList) => {
    qc.setQueryData([GET_SHAREDSPACE_CHATS_KEY], (prev?: TChats) => {
      if (prev) {
        const newChats = [ ...prev.chats ];
        const idx = newChats.findIndex(chat => chat.id === data.id);

        if (idx < 0) return;

        newChats[idx] = data;
        return { chats: newChats, hasMoreData: prev.hasMoreData };
      }
    });
  };

  const onChatDeleted = (ChatId: number) => {
    qc.setQueryData([GET_SHAREDSPACE_CHATS_KEY], (prev?: TChats) => {
      if (prev) {
        const idx = prev.chats.findIndex(chat => chat.id === ChatId);

        if (idx < 0) return;

        const head = prev.chats.slice(0, idx);
        const tail = prev.chats.slice(idx + 1, prev.chats.length);

        return { chats: [ ...head, ...tail ], hasMoreData: prev.hasMoreData };
      }
    });
  };

  const onChatImageDeleted = (ChatId: number, ImageId: number) => {
    qc.setQueryData([GET_SHAREDSPACE_CHATS_KEY], (prev?: TChats) => {
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

  useEffect(() => {
    socket?.on(`publicChats:${ChatsCommandList.CHAT_CREATED}`, onChatCreated);
    socket?.on(`publicChats:${ChatsCommandList.CHAT_UPDATED}`, onChatUpdated);
    socket?.on(`publicChats:${ChatsCommandList.CHAT_DELETED}`, onChatDeleted);
    socket?.on(`publicChats:${ChatsCommandList.CHAT_IMAGE_DELETED}`, onChatImageDeleted);

    return () => {
      socket?.off(`publicChats:${ChatsCommandList.CHAT_CREATED}`, onChatCreated);
      socket?.off(`publicChats:${ChatsCommandList.CHAT_UPDATED}`, onChatUpdated);
      socket?.off(`publicChats:${ChatsCommandList.CHAT_DELETED}`, onChatDeleted);
      socket?.off(`publicChats:${ChatsCommandList.CHAT_IMAGE_DELETED}`, onChatImageDeleted);
    };
  }, [socket]);

  const onChangeFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (!e.target.files) return;

    if (files.length > 5) {
      return toast.info(tooManyImagesMessage, {
        ...defaultToastOption,
      });
    }

    const result = Object.values(e.target.files).map((file) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        setPreviews(prev => [ ...prev, reader.result ]);
      };

      reader.readAsDataURL(file);

      return file;
    });

    setFiles(prev => [ ...prev, ...result ]);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedChat = chat.trim();

    if (!trimmedChat && !files.length) {
      setChat('');
      return;
    }

    const formData = new FormData();

    formData.append('content', trimmedChat);
    files.forEach((file) => {
      formData.append('images', file);
    });

    createSharedspaceChats(url, formData)
      .then(() => {
        setChat('');
        setFiles([]);
        setPreviews([]);
        scrollbarRef?.current?.scrollTo(0, 0);
      })
      .catch((err) => {
        setChat('');
        setFiles([]);
        setPreviews([]);

        const errorMessage = err?.respose?.status === 413 ?
          imageTooLargeMessage :
          waitingMessage;

        toast.error(errorMessage, {
          ...defaultToastOption,
        });
      });
  };
  
  return (
    <Block>
      <ChatDiv>
        <ChatList
          ref={scrollbarRef}
          onScroll={onScroll}>
          {showNewChat.active &&
            <NewChatNotifier
              chat={showNewChat.chat}
              onClick={() => scrollbarRef?.current?.scrollTo(0, 0)} />}
          {Boolean(previews.length) &&
            <ImagePreviewer
              previews={previews}
              deleteFile={deleteFile} />
          }
          {!Boolean(chatList?.chats.length) && <FirstChatNotice>첫 메시지를 전송해보세요</FirstChatNotice>}
          {!isLoading ?
            chatList?.chats.map((chat: TChatList, idx: number) => {

              const hasDateSeparator =
                (idx >= chatList.chats.length - 1 && !chatList.hasMoreData) ||
                (idx < chatList.chats.length - 1 && dayjs(chat.createdAt).tz(localTimeZone).format('DD') !== dayjs(chatList.chats[idx + 1].createdAt).tz(localTimeZone).format('DD'));

              if (hasDateSeparator) {
                return (
                  <Fragment key={chat.id}>
                    <Chat
                      key={chat.id}
                      chat={chat} />
                    <DateSeparator date={formatDate(dayjs(chat.createdAt).tz(localTimeZone).format())} />
                  </Fragment>
                );
              }

              return <Chat
                key={chat.id}
                chat={chat} />;
            }) :
            <SkeletonChatList />
          }
        </ChatList>
        <SidePadding>
          <Form onSubmit={onSubmit}>
            <IconButton
              onClick={onOpen}
              type='button'>
              <AddCircleIcon fontSize='large' />
            </IconButton>
            <ChatInput
              value={chat}
              onChange={onChangeChat}
              placeholder='메시지 보내기' />
            <IconButton type='submit'>
              <SendIcon fontSize='large' />
            </IconButton>
          </Form>
        </SidePadding>
        <Menu
          aria-labelledby='demo-positioned-button'
          anchorEl={anchorEl}
          open={open}
          onClick={onClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          sx={muiMenuDefaultSx}>
            <Label htmlFor='image-upload'>
              <MenuItem sx={{ gap: '5px' }}>
                <AddPhotoIcon />
                <span>이미지 업로드</span>
              </MenuItem>
            </Label>
        </Menu>
        <InputFile
          onChange={onChangeFiles}
          id='image-upload'
          type='file'
          accept='image/*'
          multiple />
      </ChatDiv>
    </Block>
  );
};

export default SharedspacesChatPage;

const Block = styled.div`
  display: flex;
  justify-content: center;
  width: 70%;
`;

const ChatDiv = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 1000px;
  height: 100%;
  background-color: var(--dark-gray);
`;

const ChatList = styled.ul`
  display: flex;
  flex-direction: column-reverse;
  width: 100%;
  height: 80%;
  padding: 0;
  padding-bottom: 30px;
  margin: 0;
  gap: 20px;
  overflow-y: scroll;
`;

const Form = styled.form`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 60px;
  padding: 15px;
  background-color: var(--light-gray);
  border-radius: 8px;
  gap: 10px;
`;

const ChatInput = styled.input`
  width: 100%;
  color: var(--white);
  font-size: 20px;
  background-color: var(--light-gray);
  border: none;
  outline: none;
`;

const IconButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px;
  color: var(--white);
  background-color: rgba(255, 255, 255, 0);
  border: none;
  border-radius: 10px;
  cursor: pointer;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const SidePadding = styled.div`
  padding: 0 20px;
`;

const InputFile = styled.input`
  position: absolute;
  width: 0;
  height: 0;
  padding: 0;
  overflow: hidden;
  border: 0;
`;

const Label = styled.label`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  gap: 5px;
`;

const FirstChatNotice = styled.span`
  font-size: 18px;
  font-weight: 600;
  color: var(--white);
  text-align: center;
  padding-bottom: 50px;
`;