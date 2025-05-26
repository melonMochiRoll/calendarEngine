import React, { FC } from 'react';
import styled from '@emotion/styled';
import useSharedspace from 'Hooks/queries/useSharedspace';
import MemberItem from '../sharedspaceManager/MemberItem';

const SharedspaceMemberListMain: FC = () => {
  const { data: spaceData } = useSharedspace({ suspense: true, throwOnError: true });
  
  return (
    <List>
      {spaceData.Sharedspacemembers.map((user) => {
        return (
          <MemberItem
            key={user.UserId}
            OwnerData={spaceData.Owner}
            SharedspaceMembersAndUser={user} />
        );
      })}
    </List>
  );
};

export default SharedspaceMemberListMain;

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