import React, { FC } from 'react';
import styled from '@emotion/styled';
import { TSearchUsers, TSharedspaceMembersRoles, TSharedspaceMetaData } from 'Typings/types';
import UserItem from './UserItem';
import SharedspaceManagerError from './SharedspaceManagerError';

interface SharedspaceManagerResultProps {
  query: string;
  spaceData: TSharedspaceMetaData;
  searchUsersData: TSearchUsers[];
  onCreateMember: (UserId: number, RoleName: TSharedspaceMembersRoles) => void;
};

const SharedspaceManagerResult: FC<SharedspaceManagerResultProps> = ({
  query,
  spaceData,
  searchUsersData,
  onCreateMember,
}) => {
  return (
    <>
      {searchUsersData?.length ?
        <UserList>
          {searchUsersData?.map((data) => {
            return (
              <UserItem
                key={data.email}
                spaceData={spaceData}
                searchUserData={data}
                onCreateMember={onCreateMember} />
            );
          })}
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