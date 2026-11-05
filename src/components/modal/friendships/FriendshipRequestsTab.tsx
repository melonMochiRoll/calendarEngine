import React, { FC } from 'react';
import styled from '@emotion/styled';
import { useFriendshipRequests } from 'Src/hooks/queries/useFriendshipRequests';
import FriendshipRequestItem from './FriendshipRequestItem';
import RefreshIcon from '@mui/icons-material/Refresh';
import { CircularProgress } from '@mui/material';
import { useInView } from 'Src/hooks/utils/useInView';

const FriendshipRequestsTab: FC = () => {
  const {
    data: friendshipRequestsData,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isFetchNextPageError,
  } = useFriendshipRequests();

  const sentinelRef = useInView(() => fetchNextPage(), {
    enable: hasNextPage && !isFetchingNextPage && !isFetchNextPageError,
    rootMargin: '100px 0px 0px 0px',
  });

  const friendshipRequests = friendshipRequestsData.pages.flatMap(page => page.friendshipRequests);

  return (
    <List>
      {
        friendshipRequests.map(friendshipRequest => {
          return (
            <FriendshipRequestItem
              key={friendshipRequest.id}
              friendshipRequest={friendshipRequest} />
          );
        })
      }
      {isFetchingNextPage && <CircularProgress size={35} />}
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
    </List>
  );
};

export default FriendshipRequestsTab;

const List = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 0;
  padding-bottom: 1%;
  margin: 0;
  overflow-y: auto;
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