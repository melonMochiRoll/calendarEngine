import React, { FC } from 'react';
import useSharedspace from 'Hooks/useSharedspace';
import useSearchUsers from 'Hooks/useSearchUsers';
import SharedspaceManagerInitPage from './SharedspaceManagerInitPage';
import { useAppSelector } from 'Hooks/reduxHooks';
import SharedspaceManagerResult from './SharedspaceManagerResult';

interface SharedspaceManagerMainProps {};

const SharedspaceManagerMain: FC<SharedspaceManagerMainProps> = ({}) => {
  const { data: spaceData } = useSharedspace({ suspense: true, throwOnError: true });
  const { data: searchUsersData } = useSearchUsers({ suspense: true, throwOnError: true });
  const { query } = useAppSelector(state => state.searchUsers);

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