import React, { FC, Fragment, memo } from 'react';
import styled from '@emotion/styled';
import dayjs from 'dayjs';
import Chat from 'Components/chat/Chat';
import DateSeparator from 'Components/chat/DateSeparator';
import NewChatNotifier from 'Components/chat/NewChatNotifier';
import ImagePreviewer from 'Components/chat/ImagePreviewer';
import { formatDate } from 'Lib/utilFunction';
import { TChatPayload } from 'Typings/types';
import useUser from 'Src/hooks/queries/useUser';

interface ChatListProps {
  chatList: TChatPayload[],
  previews: string[],
  sentinelRef: React.MutableRefObject<HTMLDivElement | null>,
  bottomRef: React.MutableRefObject<HTMLDivElement | null>,
  hasNextPage: boolean,
  showNewChat: {
    chat: string,
    email: string,
    nickname: string,
    profileImage: string,
  } | null,
  canShowNotify: React.MutableRefObject<boolean>,
  updateSharedspaceChat: (ChatRoomId: string | undefined, ChatId: string, oldContent: string, newContent: string) => void,
  deleteSharedspaceChat: (ChatRoomId: string | undefined, ChatId: string) => void,
  deleteSharedspaceChatImage: (ChatRoomId: string | undefined, ChatId: string, ImageId: string) => void,
  deleteFile: (idx: number) => void,
};

const ChatList: FC<ChatListProps> = ({
  chatList,
  previews,
  sentinelRef,
  bottomRef,
  hasNextPage,
  showNewChat,
  canShowNotify,
  updateSharedspaceChat,
  deleteSharedspaceChat,
  deleteSharedspaceChatImage,
  deleteFile,
}) => {
  const localTimeZone = dayjs.tz.guess();
  const { data: userData } = useUser();

  return (
    <List>
      <SentinelDiv ref={bottomRef} />
      {canShowNotify.current && showNewChat &&
        <NewChatNotifier
          newChat={showNewChat}
          onClick={() => bottomRef.current?.scrollIntoView({ block: 'end', behavior: 'instant' })} />}
      {Boolean(previews.length) &&
        <ImagePreviewer
          previews={previews}
          deleteFile={deleteFile} />}
      {chatList.length ?
        chatList.map((chat: TChatPayload, idx: number) => {
          const isLastChat = idx >= chatList.length - 1 && !hasNextPage;
          const isDateBoundary = idx < chatList.length - 1 && (dayjs(chat.createdAt).tz(localTimeZone).format('DD') !== dayjs(chatList[idx + 1].createdAt).tz(localTimeZone).format('DD'));
          const hasDateSeparator = isLastChat || isDateBoundary;

          if (hasDateSeparator) {
            return (
              <Fragment key={chat.id}>
                <Chat
                  key={chat.id}
                  chat={chat}
                  isMe={chat.SenderId === userData.id}
                  updateSharedspaceChat={updateSharedspaceChat}
                  deleteSharedspaceChat={deleteSharedspaceChat}
                  deleteSharedspaceChatImage={deleteSharedspaceChatImage} />
                <DateSeparator date={formatDate(dayjs(chat.createdAt).tz(localTimeZone).format())} />
              </Fragment>
            );
          }

          return <Chat
            key={chat.id}
            chat={chat}
            isMe={chat.SenderId === userData.id}
            updateSharedspaceChat={updateSharedspaceChat}
            deleteSharedspaceChat={deleteSharedspaceChat}
            deleteSharedspaceChatImage={deleteSharedspaceChatImage} />;
        })
        :
        <FirstChatNotice>첫 메시지를 전송해보세요</FirstChatNotice>}
        <SentinelDiv ref={sentinelRef} />
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

const SentinelDiv = styled.div`
  height: 1px;
  flex-shrink: 0;
`;