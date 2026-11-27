import React, { FC } from 'react';
import styled from '@emotion/styled';

interface DmChatRoomParticipantCountProps {
  participantCount: number | null,
};

const DmChatRoomParticipantCount: FC<DmChatRoomParticipantCountProps> = ({ participantCount }) => {
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