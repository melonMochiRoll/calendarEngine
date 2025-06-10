import React, { FC, useState } from 'react';
import styled from '@emotion/styled';
import { useSharedspace } from 'Hooks/queries/useSharedspace';
import { toast } from 'react-toastify';
import { defaultToastOption, successMessage, waitingMessage } from 'Constants/notices';
import { deleteSharedspaceMembers, updateSharedspaceMembers, updateSharedspaceOwner } from 'Api/sharedspacesApi';
import { useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { GET_SHAREDSPACE_KEY } from 'Constants/queryKeys';
import { TSharedspaceMembersRoles } from 'Typings/types';
import MemberItem from '../sharedspaceManager/MemberItem';

const SharedspaceMemberListMain: FC = () => {
  const { url } = useParams();
  const qc = useQueryClient();
  const { data: spaceData } = useSharedspace();
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

  const onUpdateOwner = (OwnerId: number, targetUserId: number) => {
    updateSharedspaceOwner(url, OwnerId, targetUserId)
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
        {spaceData.Sharedspacemembers.map((user) => {
          return (
            <MemberItem
              key={user.UserId}
              OwnerData={spaceData.Owner}
              SharedspaceMembersAndUser={user}
              onUpdateMemberRole={onUpdateMemberRole}
              onUpdateOwner={onUpdateOwner}
              onDeleteMember={onDeleteMember} />
          );
        })}
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