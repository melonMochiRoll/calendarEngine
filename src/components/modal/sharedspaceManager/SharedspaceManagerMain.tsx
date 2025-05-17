import React, { FC } from 'react';
import useSharedspace from 'Hooks/useSharedspace';
import SharedspaceManagerInitPage from './SharedspaceManagerInitPage';
import SharedspaceManagerResult from './SharedspaceManagerResult';
import { useSearchUsers } from 'Hooks/useSearchUsers';

interface SharedspaceManagerMainProps {
  query: string;
};

const SharedspaceManagerMain: FC<SharedspaceManagerMainProps> = ({
  query,
}) => {
  const { data: spaceData } = useSharedspace({ suspense: true, throwOnError: true });
  const { data: searchUsersData } = useSearchUsers(query);

  return (
    <>
      {query ?
        <SharedspaceManagerResult
          query={query}
          spaceData={spaceData}
          searchUsersData={searchUsersData} /> :
        <SharedspaceManagerInitPage
          spaceData={spaceData} />
      }
    </>
  );
};

export default SharedspaceManagerMain;