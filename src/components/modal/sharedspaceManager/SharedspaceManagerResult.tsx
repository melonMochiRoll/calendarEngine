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
    <Main>
      {
        searchUsersData?.length ?
          <List>
            {searchUsersData?.map((data) => {
              return (
                <UserItem
                  key={data.email}
                  spaceData={spaceData}
                  searchUserData={data} />
              );
            })}
          </List> :
          <SharedspaceManagerError message={`"${query}" 에 대한 검색 결과가 없습니다.`} />
      }
    </Main>
  );
};

export default SharedspaceManagerResult;

const Main = styled.main`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 85%;
`;

const List = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
`;