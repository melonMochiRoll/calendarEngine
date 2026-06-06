import React, { FC, Fragment, memo } from 'react';
import styled from '@emotion/styled';
import dayjs from 'dayjs';
import Chat from 'Components/chat/Chat';
import DateSeparator from 'Components/chat/DateSeparator';
import NewChatNotifier from 'Components/chat/NewChatNotifier';
import ImagePreviewer from 'Components/chat/ImagePreviewer';
import { formatDate } from 'Lib/utilFunction';
import { TChatPayload, TChats } from 'Typings/types';
import { throttle } from 'lodash';
import { useQueryClient } from '@tanstack/react-query';
import { GET_SHAREDSPACE_CHATS_KEY } from 'Src/constants/queryKeys';

interface ChatListProps {
  chatList: TChats,
  previews: string[],
  scrollbarRef: React.RefObject<HTMLUListElement>,
  showNewChat: {
    chat: string,
    email: string,
    nickname: string,
    profileImage: string,
  } | null,
  setShowNewChat: React.Dispatch<React.SetStateAction<{
    chat: string,
    email: string,
    nickname: string,
    profileImage: string,
  } | null>>,
  canShowNotify: React.MutableRefObject<boolean>,
  updateSharedspaceChat: (url: string | undefined, ChatId: string, oldContent: string, newContent: string) => void,
  deleteSharedspaceChat: (url: string | undefined, ChatId: string) => void,
  deleteSharedspaceChatImage: (url: string | undefined, ChatId: string, ImageId: string) => void,
  loadMore: () => void,
  onSubmit: (url: string | undefined, chat: string, images: File[], previews: string[]) => void,
  deleteFile: (idx: number) => void,
};

const ChatList: FC<ChatListProps> = ({
  chatList,
  previews,
  scrollbarRef,
  showNewChat,
  setShowNewChat,
  canShowNotify,
  updateSharedspaceChat,
  deleteSharedspaceChat,
  deleteSharedspaceChatImage,
  loadMore,
  onSubmit,
  deleteFile,
}) => {
  const localTimeZone = dayjs.tz.guess();
  const qc = useQueryClient();

  const onScroll = throttle(() => {
    if (scrollbarRef.current) {
      const isTop = scrollbarRef.current.scrollHeight - 100 < scrollbarRef.current.clientHeight - scrollbarRef.current.scrollTop;

      if (isTop && chatList.hasMoreData) {
        loadMore();
        scrollbarRef?.current?.scrollTo(0, -200);
      }

      const newChatNoticeBorder = (0 - scrollbarRef.current.scrollTop) > scrollbarRef.current.clientHeight / 2;
      if (newChatNoticeBorder && !canShowNotify.current) {
        canShowNotify.current = true;
      }

      const isBottom = scrollbarRef.current.scrollTop > -100;
      if (isBottom && canShowNotify.current) {
        canShowNotify.current = false;
        setShowNewChat(null);
      }
    }
  }, 300);

  const deleteErrorChat = (url: string | undefined, idx: number) => {
    qc.setQueryData<TChats>([GET_SHAREDSPACE_CHATS_KEY, url], (prev) => {
      if (!prev) return;

      const rest = [ ...prev.chats.slice(0, idx), ...prev.chats.slice(idx + 1, prev.chats.length) ];
      prev.chats[idx].ChatImages.forEach(image => URL.revokeObjectURL(image?._tempPath || ''));

      return {
        ...prev,
        chats: rest || [], 
      };
    });
  };

  const reSubmit = (url: string | undefined, chat: TChatPayload, idx: number) => {
    qc.setQueryData<TChats>([GET_SHAREDSPACE_CHATS_KEY, url], (prev) => {
      if (!prev) return;

      const rest = [ ...prev.chats.slice(0, idx), ...prev.chats.slice(idx + 1, prev.chats.length) ];

      return {
        ...prev,
        chats: rest || [], 
      };
    });
    onSubmit(url, chat.content, chat._imageFiles || [], chat.ChatImages.map(image => image._tempPath || ''));
  };

  return (
    <List
      ref={scrollbarRef}
      onScroll={onScroll}>
      {canShowNotify.current && showNewChat &&
        <NewChatNotifier
          newChat={showNewChat}
          onClick={() => scrollbarRef?.current?.scrollTo(0, 0)} />}
      {Boolean(previews.length) &&
        <ImagePreviewer
          previews={previews}
          deleteFile={deleteFile} />}
      {chatList.chats.length ?
        chatList.chats.map((chat: TChatPayload, idx: number) => {
          const isLastChat = idx >= chatList.chats.length - 1 && !chatList.hasMoreData;
          const isDateBoundary = idx < chatList.chats.length - 1 && (dayjs(chat.createdAt).tz(localTimeZone).format('DD') !== dayjs(chatList.chats[idx + 1].createdAt).tz(localTimeZone).format('DD'));
          const hasDateSeparator = isLastChat || isDateBoundary;

          if (hasDateSeparator) {
            return (
              <Fragment key={chat.id}>
                <Chat
                  key={chat.id}
                  idx={idx}
                  chat={chat}
                  updateSharedspaceChat={updateSharedspaceChat}
                  deleteSharedspaceChat={deleteSharedspaceChat}
                  deleteSharedspaceChatImage={deleteSharedspaceChatImage}
                  deleteErrorChat={deleteErrorChat}
                  reSubmit={reSubmit} />
                <DateSeparator date={formatDate(dayjs(chat.createdAt).tz(localTimeZone).format())} />
              </Fragment>
            );
          }

          return <Chat
            key={chat.id}
            idx={idx}
            chat={chat}
            updateSharedspaceChat={updateSharedspaceChat}
            deleteSharedspaceChat={deleteSharedspaceChat}
            deleteSharedspaceChatImage={deleteSharedspaceChatImage}
            deleteErrorChat={deleteErrorChat}
            reSubmit={reSubmit} />;
        })
        :
        <FirstChatNotice>첫 메시지를 전송해보세요</FirstChatNotice>}
    </List>
  );
};

export default memo(ChatList);

const List = styled.ul`
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

const FirstChatNotice = styled.span`
  font-size: 18px;
  font-weight: 600;
  color: var(--white);
  text-align: center;
  padding-bottom: 50px;
`;