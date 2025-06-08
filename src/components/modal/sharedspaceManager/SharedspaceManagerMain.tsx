import React, { FC } from 'react';
import useSharedspace from 'Hooks/queries/useSharedspace';
import SharedspaceManagerInitPage from './SharedspaceManagerInitPage';
import SharedspaceManagerResult from './SharedspaceManagerResult';
import { useSearchUsers } from 'Hooks/queries/useSearchUsers';
import { createSharedspaceMembers } from 'Api/sharedspacesApi';
import { useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { GET_SHAREDSPACE_KEY } from 'Constants/queryKeys';

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

  const onCreateMember = (UserId: number, RoleName: string) => {
    createSharedspaceMembers(url, UserId, RoleName)
      .then(async () => {
        await qc.refetchQueries([GET_SHAREDSPACE_KEY, url]);
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
          spaceData={spaceData} />
      }
    </>
  );
};

export default SharedspaceManagerMain;