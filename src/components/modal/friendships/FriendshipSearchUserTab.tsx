import React, { FC, useState } from 'react';
import styled from '@emotion/styled';
import { useDebounce } from 'Src/hooks/utils/useDebounce';
import { useSearchUsersForFriendship } from 'Src/hooks/queries/useSearchUsersForFriendship';
import FriendshipSearchItem from './FriendshipSearchItem';

const FriendshipSearchUserTab: FC = () => {
  const [ query, setQuery ] = useState('');
  const debouncedQuery = useDebounce(query, 500);

  const { data: searchUsersData, loadMore } = useSearchUsersForFriendship(debouncedQuery);
  const { users, hasMoreData } = searchUsersData;

  return (
    <>
      <Input
        autoFocus
        type='text'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder='이메일 혹은 닉네임 검색' />
      <List>
        {
          users.map(user => {
            return (
              <FriendshipSearchItem
                key={user.id}
                user={user} />
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
    </>
  );
};

export default FriendshipSearchUserTab;

const Input = styled.input`
  width: 100%;
  padding: 10px 20px;
  color: var(--white);
  font-size: 20px;
  background-color: var(--black);
  border: none;
  border-bottom: 1px solid var(--light-gray);
  outline: none;
`;

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