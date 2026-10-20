import React, { FC } from 'react';
import styled from '@emotion/styled';
import { useChatRoomParticipantCount } from 'Src/hooks/queries/useChatRoomParticipantCount';

const DmChatRoomParticipantCount: FC = () => {
  const { data: participantCount } = useChatRoomParticipantCount();

  return (
    <Title>{`참가자 목록 - ${participantCount}`}</Title>
  );
};

export default DmChatRoomParticipantCount;

const Title = styled.h2`
  font-size: 18px;
  color: var(--gray-4);
  margin: 0;
`;