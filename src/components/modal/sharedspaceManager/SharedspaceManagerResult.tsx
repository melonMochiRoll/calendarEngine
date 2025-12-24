import React, { FC } from 'react';
import styled from '@emotion/styled';
import { TSearchUsersList, TSharedspaceMembersRoles } from 'Typings/types';
import UserItem from './UserItem';
import ErrorIcon from '@mui/icons-material/ErrorOutline';

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
          <NotFoundBlock>
            <ErrorIcon sx={ErrorInlineStyle} />
            <NotFoundMessage>{`"${query}" 에 대한 검색 결과가 없습니다.`}</NotFoundMessage>
          </NotFoundBlock>
      }
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

const NotFoundBlock = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const ErrorInlineStyle = {
  color: 'var(--white)',
  fontSize: '64px',
  paddingBottom: '15px',
};

const NotFoundMessage = styled.span`
  color: var(--white);
  font-size: 20px;
  font-weight: 600;
`;