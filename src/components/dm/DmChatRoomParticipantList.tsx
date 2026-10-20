import React, { FC } from 'react';
import styled from '@emotion/styled';
import { useChatRoomParticipants } from 'Src/hooks/queries/useChatRoomParticipants';
import { useFriendships } from 'Src/hooks/queries/useFriendships';
import useUser from 'Src/hooks/queries/useUser';
import DmChatRoomParticipantItem from './DmChatRoomParticipantItem';
import { useInView } from 'Src/hooks/utils/useInView';
import DmChatRoomParticipantCount from './DmChatRoomParticipantCount';
import RefreshIcon from '@mui/icons-material/Refresh';

const DmChatRoomParticipantList: FC = () => {
  const { data: userData } = useUser();
  const { data: useFriendshipsData } = useFriendships();

  const {
    data: participantsData,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isFetchNextPageError,
  } = useChatRoomParticipants();

  const sentinelRef = useInView(() => fetchNextPage(), {
    enable: hasNextPage && !isFetchingNextPage && !isFetchNextPageError,
    rootMargin: '100px 0px 0px 0px',
  });

  const participants = participantsData.pages.flatMap(page => page.participants);

  return (
    <ParticipantSection>
      <DmChatRoomParticipantCount />
      <ParticipantUl>
        {
          participants.map((participant) => {
            const isMe = userData.id === participant.UserId;
            const isFriend = !isMe && useFriendshipsData.friendships.some(friendship => friendship.RequesterId === participant.UserId);

            return (
              <DmChatRoomParticipantItem
                key={participant.id} 
                participant={participant}
                UserId={userData.id}
                isMe={isMe}
                isFriend={isFriend} />
            );
          })
        }
        <SentinelDiv ref={sentinelRef} />
        {
          isFetchNextPageError &&
          <ErrorDiv>
            <ErrorSpan>문제가 발생했습니다.</ErrorSpan>
            <RetryButton onClick={() => fetchNextPage()}>
              <RefreshIcon />
            </RetryButton>
          </ErrorDiv>
        }
      </ParticipantUl>
    </ParticipantSection>
  );
};

export default DmChatRoomParticipantList;

const ParticipantSection = styled.section`
  display: flex;
  flex-direction: column;
  padding: 5px 10px;
  gap: 10px;
`;

const ParticipantUl = styled.ul`
  margin: 0;
  padding: 0;
`;

const SentinelDiv = styled.div`
  height: 1px;
  flex-shrink: 0;
`;

const ErrorDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 35px 0;
  gap: 10px;
`;

const ErrorSpan = styled.span`
  color: var(--gray-6);
  font-size: 14px;
`;

const RetryButton = styled.button`
  background-color: rgba(0, 0, 0, 0);
  border: none;
  cursor: pointer;

  svg {
    font-size: 45px;
    color: var(--gray-6);

    &:hover {
      color: var(--gray-4);
    }
  }
`;