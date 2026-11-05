import React, { FC } from 'react';
import styled from '@emotion/styled';
import JoinRequestItem from './JoinRequestItem';
import { TJoinRequest } from 'Src/typings/types';
import { CircularProgress } from '@mui/material';

interface JoinRequestManagerListProps {
  joinRequests: TJoinRequest[],
  hasNextPage: boolean,
  fetchNextPage: () => void,
  isFetchingNextPage: boolean,
  isFetchNextPageError: boolean,
  onResolveMenuClick: (SharedspaceId: string | undefined, id: string, roleName: string) => Promise<void>,
  onRejectMenuClick: (SharedspaceId: string | undefined, id: string) => Promise<void>,
};

const JoinRequestManagerList: FC<JoinRequestManagerListProps> = ({
  joinRequests,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
  isFetchNextPageError,
  onResolveMenuClick,
  onRejectMenuClick,
}) => {
  return (
    <List>
      {joinRequests.map((request) => {
        return (
          <JoinRequestItem
            key={request.id}
            request={request}
            onResolveMenuClick={onResolveMenuClick}
            onRejectMenuClick={onRejectMenuClick} />
        );
      })}
      {
        isFetchingNextPage ?
          <CircularProgress size={35} />
          :
          <LoadMore disabled={!hasNextPage} onClick={() => fetchNextPage()}>
            {hasNextPage ? 'Load More' : '목록 없음'}
          </LoadMore>
      }
    </List>
  );
};

export default JoinRequestManagerList;

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
  margin: 20px 0;
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