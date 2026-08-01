import React, { FC } from 'react';
import styled from '@emotion/styled';
import ChatRoomUpdaterHeader from './ChatRoomUpdaterHeader';
import ChatRoomUpdaterMain from './ChatRoomUpdaterMain';

export interface ChatRoomUpdaterModalProps {
  SharedspaceId: string,
  ChatRoomId: string,
  prevName: string,
};

const ChatRoomUpdaterModal: FC<ChatRoomUpdaterModalProps> = ({
  SharedspaceId,
  ChatRoomId,
  prevName,
}) => {
  return (
    <Block onClick={e => e.stopPropagation()}>
      <ChatRoomUpdaterHeader />
      <ChatRoomUpdaterMain
        SharedspaceId={SharedspaceId}
        ChatRoomId={ChatRoomId}
        prevName={prevName} />
    </Block>
  );
};

export default ChatRoomUpdaterModal;

const Block = styled.div`
  display: flex;
  flex-direction: column;
  width: 550px;
  height: 300px;
  border: 1px solid #1d2126;
  border-radius: 15px;
  background-color: var(--black);
  box-shadow: 1px 1px 10px 2px #000;
`;