import React, { FC } from 'react';
import styled from '@emotion/styled';
import { useFriendshipRequests } from 'Src/hooks/queries/useFriendshipRequests';
import FriendshipRequestItem from './FriendshipRequestItem';
import RefreshIcon from '@mui/icons-material/Refresh';
import { CircularProgress } from '@mui/material';

const FriendshipRequestsTab: FC = () => {
  const {
    data: friendshipRequestsData,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isFetchNextPageError,
  } = useFriendshipRequests();

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
      {
        isFetchingNextPage ?
          <CircularProgress size={35} /> :
          hasNextPage ?
            <LoadMore onClick={() => fetchNextPage()}>
              Load More
            </LoadMore>
            :
            <DisableLoadMore>
              목록 없음
            </DisableLoadMore>
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

const LoadMore = styled.button`
  font-size: 24px;
  font-weight: 600;
  padding: 10px 15px;
  margin: 30px 0;
  color: var(--white);
  border: 1px solid var(--light-gray);
  border-radius: 5px;
  background-color: var(--black);
  cursor: pointer;
  transition: all 0.1s linear;

  &:hover {
    background-color: var(--red);
    border-color: var(--red);
  }
`;

const DisableLoadMore = styled.button`
  font-size: 24px;
  font-weight: 600;
  padding: 10px 15px;
  margin: 30px 0;
  color: var(--gray-7);
  border: 1px solid var(--light-gray);
  border-radius: 5px;
  background-color: var(--black);
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