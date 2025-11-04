import React, { FC, useState } from 'react';
import styled from '@emotion/styled';
import { toast } from 'react-toastify';
import { defaultToastOption, successMessage, waitingMessage } from 'Constants/notices';
import { deleteSharedspaceMembers, updateSharedspaceMembers, updateSharedspaceOwner } from 'Api/sharedspacesApi';
import { useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { GET_SHAREDSPACE_KEY } from 'Constants/queryKeys';
import { TSharedspaceMembersRoles } from 'Typings/types';
import MemberItem from '../sharedspaceManager/MemberItem';
import { useSharedpacemembers } from 'Src/hooks/queries/useSharedpacemembers';

const SharedspaceMemberListMain: FC = () => {
  const { url } = useParams();
  const qc = useQueryClient();
  const { data: membersData, nextPage } = useSharedpacemembers(); 
  const [ error, setError ] = useState('');

  const onUpdateMemberRole = (UserId: number, roleName: TSharedspaceMembersRoles) => {
    updateSharedspaceMembers(url, UserId, roleName)
      .then(async () => {
        await qc.refetchQueries([GET_SHAREDSPACE_KEY, url]);
        toast.success(successMessage, {
          ...defaultToastOption,
        });
      })
      .catch(() => {
        setError(waitingMessage);
      });
  };

  const onUpdateOwner = (UserId: number) => {
    updateSharedspaceOwner(url, UserId)
      .then(async () => {
        await qc.refetchQueries([GET_SHAREDSPACE_KEY, url]);
        toast.success(successMessage, {
          ...defaultToastOption,
        });
      })
      .catch(() => {
        setError(waitingMessage);
      });
  };

  const onDeleteMember = (UserId: number) => {
    deleteSharedspaceMembers(url, UserId)
      .then(async () => {
        await qc.refetchQueries([GET_SHAREDSPACE_KEY, url]);
        toast.success(successMessage, {
          ...defaultToastOption,
        });
      })
      .catch(() => {
        setError(waitingMessage);
      });
  };
  
  return (
    <>
      <List>
        {membersData.items.map((member) => {
          return (
            <MemberItem
              key={member.UserId}
              item={member}
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
      {error && <ErrorSpan>{error}</ErrorSpan>}
    </>
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