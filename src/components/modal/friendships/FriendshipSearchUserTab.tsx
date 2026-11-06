import React, { FC, useState } from 'react';
import styled from '@emotion/styled';
import { useDebounce } from 'Src/hooks/utils/useDebounce';
import { useSearchUsersForFriendship } from 'Src/hooks/queries/useSearchUsersForFriendship';
import FriendshipSearchItem from './FriendshipSearchItem';
import { useInView } from 'Src/hooks/utils/useInView';

const FriendshipSearchUserTab: FC = () => {
  const [ query, setQuery ] = useState('');
  const debouncedQuery = useDebounce(query, 500);

  const {
    data: searchUsersData,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isFetchNextPageError,
  } = useSearchUsersForFriendship(debouncedQuery);

  const sentinelRef = useInView(() => fetchNextPage(), {
    enable: hasNextPage && !isFetchingNextPage && !isFetchNextPageError,
    rootMargin: '100px 0px 0px 0px',
  });

  const users = searchUsersData.pages.flatMap(page => page.users);

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
        <SentinelDiv ref={sentinelRef} />
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

const SentinelDiv = styled.div`
  height: 1px;
  flex-shrink: 0;
`;