import React, { FC } from 'react';
import styled from '@emotion/styled';
import ChatRoomCreaterMain from './ChatRoomCreaterMain';
import ChatRoomCreaterHeader from './ChatRoomCreaterHeader';

export interface ChatRoomCreaterModalProps {
  SharedspaceId: string,
};

const ChatRoomCreaterModal: FC<ChatRoomCreaterModalProps> = ({ SharedspaceId }) => {
  return (
    <Block onClick={e => e.stopPropagation()}>
      <ChatRoomCreaterHeader />
      <ChatRoomCreaterMain SharedspaceId={SharedspaceId} />
    </Block>
  );
};

export default ChatRoomCreaterModal;

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