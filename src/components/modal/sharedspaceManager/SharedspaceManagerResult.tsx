import React, { FC } from 'react';
import styled from '@emotion/styled';
import { TSearchUsers, TSharedspaceMetaData } from 'Typings/types';
import UserItem from './UserItem';
import SharedspaceManagerError from './SharedspaceManagerError';

interface SharedspaceManagerResultProps {
  query: string;
  spaceData: TSharedspaceMetaData;
  searchUsersData: TSearchUsers[];
};

const SharedspaceManagerResult: FC<SharedspaceManagerResultProps> = ({
  query,
  spaceData,
  searchUsersData,
}) => {
  return (
    <Block>
      {searchUsersData?.length ?
        <UserList>
          {searchUsersData?.map((data) => {
            return (
              <UserItem
                key={data.email}
                spaceData={spaceData}
                searchUserData={data} />
            );
          })}
        </UserList> :
        <SharedspaceManagerError message={`"${query}" 에 대한 검색 결과가 없습니다.`} />}
    </Block>
  );
};

export default SharedspaceManagerResult;

const Block = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 85%;
`;

const UserList = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
`;