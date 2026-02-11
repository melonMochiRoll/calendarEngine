import React, { FC, useState } from 'react';
import styled from '@emotion/styled';
import { useSharedspace } from 'Hooks/queries/useSharedspace';
import SharedspaceManagerInitPage from './SharedspaceManagerInitPage';
import SharedspaceManagerResult from './SharedspaceManagerResult';
import { useSearchUsers } from 'Hooks/queries/useSearchUsers';
import { createSharedspaceMembers, deleteSharedspaceMembers, updateSharedspaceMembers, updateSharedspaceOwner, updateSharedspacePrivate } from 'Api/sharedspacesApi';
import { useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { GET_SHAREDSPACE_KEY } from 'Constants/queryKeys';
import { TSharedspaceMembersRoles } from 'Typings/types';
import { toast } from 'react-toastify';
import { defaultToastOption, successMessage, waitingMessage } from 'Constants/notices';
import { useSharedspacemembers } from 'Src/hooks/queries/useSharedspacemembers';

interface SharedspaceManagerMainProps {
  query: string,
};

const SharedspaceManagerMain: FC<SharedspaceManagerMainProps> = ({ query }) => {
  const { url } = useParams();
  const qc = useQueryClient();

  const { data: spaceData } = useSharedspace();
  const { data: searchUsersData, nextPage: searchUsersNextPage } = useSearchUsers(query);
  const { data: membersData, nextPage: sharedspaceMembersNextPage } = useSharedspacemembers(); 
  const [ error, setError ] = useState('');

  const onCreateMember = (UserId: number, RoleName: TSharedspaceMembersRoles) => {
    createSharedspaceMembers(url, UserId, RoleName)
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

  const onUpdateSharedspacePrivate = (Private: boolean) => {
    updateSharedspacePrivate(url, Private)
      .then(async () => {
        await qc.refetchQueries([GET_SHAREDSPACE_KEY, url]);
      })
      .catch(() => {
        setError(waitingMessage);
      });
  };

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
    <Main>
      {error && <ErrorSpan>{error}</ErrorSpan>}
      {query ?
        <SharedspaceManagerResult
          query={query}
          searchUsersData={searchUsersData}
          nextPage={searchUsersNextPage}
          onCreateMember={onCreateMember} /> :
        <SharedspaceManagerInitPage
          membersData={membersData}
          spacePrivate={spaceData.private}
          isOwner={spaceData.permission.isOwner}
          nextPage={sharedspaceMembersNextPage}
          onUpdateSharedspacePrivate={onUpdateSharedspacePrivate}
          onUpdateMemberRole={onUpdateMemberRole}
          onUpdateOwner={onUpdateOwner}
          onDeleteMember={onDeleteMember} />
      }
    </Main>
  );
};

export default SharedspaceManagerMain;

const Main = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 85%;
  color: var(--white);
  padding: 1% 0;
`;

const ErrorSpan = styled.span`
  font-size: 16px;
  color: var(--red);
`;