import React, { FC } from 'react';
import styled from '@emotion/styled';
import MemberItem from './MemberItem';
import { useSharedspacemembers } from 'Src/hooks/queries/useSharedspacemembers';
import { useSharedspace } from 'Src/hooks/queries/useSharedspace';
import useUser from 'Src/hooks/queries/useUser';

interface SharedspaceMemberListMainProps {};

const SharedspaceMemberListMain: FC<SharedspaceMemberListMainProps> = ({}) => {
  const { data: membersData, loadMore } = useSharedspacemembers();
  const { data: spaceData } = useSharedspace();
  const { data: userData } = useUser();
  
  return (
    <Main>
      <List>
        {membersData.members.map((member) => {
          return (
            <MemberItem
              key={member.UserId}
              item={member}
              isOwner={spaceData.permission.isOwner}
              isUser={userData.id === member.UserId} />
          );
        })}
        {membersData.hasMoreData &&
          <LoadMore onClick={loadMore}>
            Load More
          </LoadMore>
        }
      </List>
    </Main>
  );
};

export default SharedspaceMemberListMain;

const Main = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 85%;
  color: var(--white);
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

const ErrorSpan = styled.span`
  font-size: 16px;
  color: var(--red);
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