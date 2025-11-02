import React, { FC, Fragment } from 'react';
import styled from '@emotion/styled';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import Chat from 'Components/chat/Chat';
import DateSeparator from 'Components/chat/DateSeparator';
import NewChatNotifier from 'Components/chat/NewChatNotifier';
import ImagePreviewer from 'Components/chat/ImagePreviewer';
import { formatDate } from 'Lib/utilFunction';
import { TChatPayload, TChats } from 'Typings/types';
import { DebouncedFuncLeading } from 'lodash';

interface ChatListProps {
  chatList: TChats;
  previews: Array<string | ArrayBuffer | null>;
  showNewChat: {
    chat: string,
    active: boolean,
    email: string,
    profileImage: string
  },
  scrollbarRef: React.RefObject<HTMLUListElement>;
  onScroll: DebouncedFuncLeading<() => void>;
  deleteFile: (idx: number) => void;
};

const ChatList: FC<ChatListProps> = ({
  chatList,
  previews,
  showNewChat,
  scrollbarRef,
  onScroll,
  deleteFile,
}) => {
  dayjs.extend(utc);
  dayjs.extend(timezone);
  const localTimeZone = dayjs.tz.guess();

  return (
    <List
      ref={scrollbarRef}
      onScroll={onScroll}>
      {showNewChat.active &&
        <NewChatNotifier
          chat={showNewChat.chat}
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
                  chat={chat} />
                <DateSeparator date={formatDate(dayjs(chat.createdAt).tz(localTimeZone).format())} />
              </Fragment>
            );
          }

          return <Chat
            key={chat.id}
            chat={chat} />;
        })
        :
        <FirstChatNotice>첫 메시지를 전송해보세요</FirstChatNotice>}
    </List>
  );
};

export default ChatList;

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