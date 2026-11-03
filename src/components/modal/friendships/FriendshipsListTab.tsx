import React, { FC } from 'react';
import styled from '@emotion/styled';
import { useFriendships } from 'Src/hooks/queries/useFriendships';
import FriendshipsItem from './FriendshipsItem';
import RefreshIcon from '@mui/icons-material/Refresh';
import { CircularProgress } from '@mui/material';

const FriendshipsListTab: FC = () => {
  const {
    data: friendshipsData,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isFetchNextPageError,
  } = useFriendships();

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
      {
        isFetchingNextPage ?
          <CircularProgress size={35} />
          :
          <LoadMore disabled={!hasNextPage} onClick={() => fetchNextPage()}>
            {hasNextPage ? 'Load More' : '목록 없음'}
          </LoadMore>
      }
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

const LoadMore = styled.button<{ disabled: boolean }>`
  font-size: 24px;
  font-weight: 600;
  padding: 10px 15px;
  margin: 30px 0;
  color: ${({disabled}) => disabled ? 'var(--gray-7)' : 'var(--white)'};
  border: 1px solid var(--light-gray);
  border-radius: 5px;
  background-color: var(--black);
  cursor: ${({disabled}) => disabled ? 'auto' : 'pointer'};
  transition: all 0.1s linear;

  ${({disabled}) => !disabled && `
    &:hover {
      background-color: var(--red);
      border-color: var(--red);
    }
  `}
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