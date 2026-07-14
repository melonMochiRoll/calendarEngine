import React, { FC } from 'react';
import styled from '@emotion/styled';
import { useFriendships } from 'Src/hooks/queries/useFriendships';
import FriendshipsItem from './FriendshipsItem';

const FriendshipsListTab: FC = () => {
  const { data: friendshipsData, loadMore } = useFriendships();
  const { friendships, hasMoreData } = friendshipsData;

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
        hasMoreData ?
          <LoadMore onClick={loadMore}>
            Load More
          </LoadMore>
          :
          <DisableLoadMore>
            목록 없음
          </DisableLoadMore>
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