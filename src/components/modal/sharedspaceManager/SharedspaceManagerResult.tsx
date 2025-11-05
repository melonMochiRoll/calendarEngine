import React, { FC } from 'react';
import styled from '@emotion/styled';
import { TSearchUsersList, TSharedspaceMembersRoles } from 'Typings/types';
import UserItem from './UserItem';
import SharedspaceManagerError from './SharedspaceManagerError';

interface SharedspaceManagerResultProps {
  query: string,
  searchUsersData: TSearchUsersList,
  nextPage: () => void,
  onCreateMember: (UserId: number, RoleName: TSharedspaceMembersRoles) => void,
};

const SharedspaceManagerResult: FC<SharedspaceManagerResultProps> = ({
  query,
  searchUsersData,
  nextPage,
  onCreateMember,
}) => {
  const { items, hasMoreData } = searchUsersData;

  return (
    <>
      {items.length ?
          <UserList>
            {items.map((user) => {
              return (
                <UserItem
                  key={user.email}
                  user={user}
                  onCreateMember={onCreateMember} />
              );
            })}
            {hasMoreData &&
              <LoadMore onClick={nextPage}>
                Load More
              </LoadMore>
            }
          </UserList> :
        <SharedspaceManagerError message={`"${query}" 에 대한 검색 결과가 없습니다.`} />}
    </>
  );
};

export default SharedspaceManagerResult;

const UserList = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
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