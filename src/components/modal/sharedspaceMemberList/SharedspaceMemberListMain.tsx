import React, { FC } from 'react';
import styled from '@emotion/styled';
import { deleteSharedspaceMembers, updateSharedspaceMembers, updateSharedspaceOwner } from 'Api/sharedspacesApi';
import { useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { GET_SHAREDSPACE_KEY } from 'Constants/queryKeys';
import { TSharedspaceMembersRoles } from 'Typings/types';
import MemberItem from './MemberItem';
import { useSharedspacemembers } from 'Src/hooks/queries/useSharedspacemembers';
import { useSharedspace } from 'Src/hooks/queries/useSharedspace';

interface SharedspaceMemberListMainProps {};

const SharedspaceMemberListMain: FC<SharedspaceMemberListMainProps> = ({}) => {
  const { url } = useParams();
  const qc = useQueryClient();
  const { data: membersData, nextPage } = useSharedspacemembers();
  const { data: spaceData } = useSharedspace();

  const onUpdateMemberRole = async (UserId: number, roleName: TSharedspaceMembersRoles) => {
    try {
      await updateSharedspaceMembers(url, UserId, roleName);
      await qc.refetchQueries([GET_SHAREDSPACE_KEY, url]);
    } catch (err) {
      throw err;
    }
  };

  const onUpdateOwner = async (UserId: number) => {
    try {
      await updateSharedspaceOwner(url, UserId);
      await qc.refetchQueries([GET_SHAREDSPACE_KEY, url]);
    } catch (err) {
      throw err;
    }
  };

  const onDeleteMember = async (UserId: number) => {
    try {
      await deleteSharedspaceMembers(url, UserId);
      await qc.refetchQueries([GET_SHAREDSPACE_KEY, url]);
    } catch (err) {
      throw err;
    }
  };
  
  return (
    <Main>
      <List>
        {membersData.items.map((member) => {
          return (
            <MemberItem
              key={member.UserId}
              item={member}
              isOwner={spaceData.permission.isOwner}
              onUpdateMemberRole={onUpdateMemberRole}
              onUpdateOwner={onUpdateOwner}
              onDeleteMember={onDeleteMember} />
          );
        })}
        {membersData.hasMoreData &&
          <LoadMore onClick={nextPage}>
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