import React, { FC } from 'react';
import styled from '@emotion/styled';
import { useFriendships } from 'Src/hooks/queries/useFriendships';
import FriendshipsItem from './FriendshipsItem';
import RefreshIcon from '@mui/icons-material/Refresh';
import { CircularProgress } from '@mui/material';
import { useInView } from 'Src/hooks/utils/useInView';

const FriendshipsListTab: FC = () => {
  const {
    data: friendshipsData,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isFetchNextPageError,
  } = useFriendships();

  const sentinelRef = useInView(() => fetchNextPage(), {
    enable: hasNextPage && !isFetchingNextPage && !isFetchNextPageError,
    rootMargin: '100px 0px 0px 0px',
  });

  const friendships = friendshipsData.pages.flatMap(page => page.friendships);

  return (
    <List>
      {
        friendships.map(friendship => {
          return (
            <FriendshipsItem
              key={friendship.id}
              friendship={friendship} />
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

export default FriendshipsListTab;

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