import React, { FC } from 'react';
import useSharedspace from 'Hooks/queries/useSharedspace';
import SharedspaceManagerInitPage from './SharedspaceManagerInitPage';
import SharedspaceManagerResult from './SharedspaceManagerResult';
import { useSearchUsers } from 'Hooks/queries/useSearchUsers';
import { createSharedspaceMembers, deleteSharedspaceMembers, updateSharedspaceMembers, updateSharedspaceOwner, updateSharedspacePrivate } from 'Api/sharedspacesApi';
import { useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { GET_SHAREDSPACE_KEY } from 'Constants/queryKeys';
import { MemberOptions, TSharedspaceMembersRoles } from 'Typings/types';
import { toast } from 'react-toastify';
import { defaultToastOption, successMessage } from 'Constants/notices';

interface SharedspaceManagerMainProps {
  query: string;
};

const SharedspaceManagerMain: FC<SharedspaceManagerMainProps> = ({
  query,
}) => {
  const qc = useQueryClient();
  const { url } = useParams();
  const { data: spaceData } = useSharedspace({ suspense: true, throwOnError: true });
  const { data: searchUsersData } = useSearchUsers(query);

  const onCreateMember = (UserId: number, RoleName: TSharedspaceMembersRoles) => {
    createSharedspaceMembers(url, UserId, RoleName)
      .then(async () => {
        await qc.refetchQueries([GET_SHAREDSPACE_KEY, url]);
      });
  };

  const onUpdateSharedspacePrivate = (Private: boolean) => {
    updateSharedspacePrivate(url, Private)
      .then(async () => {
        await qc.refetchQueries([GET_SHAREDSPACE_KEY, url]);
      });
  };

  const onUpdateMemberRole = (UserId: number, roleName: TSharedspaceMembersRoles) => {
    updateSharedspaceMembers(url, UserId, roleName)
      .then(async () => {
        await qc.refetchQueries([GET_SHAREDSPACE_KEY, url]);
          toast.success(successMessage, {
          ...defaultToastOption,
        });
      });
  };

  const onUpdateOwner = (OwnerId: number, targetUserId: number) => {
    updateSharedspaceOwner(url, OwnerId, targetUserId)
      .then(async () => {
        await qc.refetchQueries([GET_SHAREDSPACE_KEY, url]);
        toast.success(successMessage, {
          ...defaultToastOption,
        });
      });
  };

  const onDeleteMember = (UserId: number) => {
    deleteSharedspaceMembers(url, UserId)
      .then(async () => {
        await qc.refetchQueries([GET_SHAREDSPACE_KEY, url]);
        toast.success(successMessage, {
          ...defaultToastOption,
        });
      });
  };

  return (
    <>
      {query ?
        <SharedspaceManagerResult
          query={query}
          spaceData={spaceData}
          searchUsersData={searchUsersData}
          onCreateMember={onCreateMember} /> :
        <SharedspaceManagerInitPage
          spaceData={spaceData}
          onUpdateSharedspacePrivate={onUpdateSharedspacePrivate}
          onUpdateMemberRole={onUpdateMemberRole}
          onUpdateOwner={onUpdateOwner}
          onDeleteMember={onDeleteMember} />
      }
    </>
  );
};

export default SharedspaceManagerMain;