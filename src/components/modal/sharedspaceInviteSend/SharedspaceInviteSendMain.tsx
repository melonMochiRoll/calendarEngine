import React, { FC } from 'react';
import styled from '@emotion/styled';
import SearchInit from '../search/SearchInit';
import { useSearchUsers } from 'Src/hooks/queries/useSearchUsers';
import SharedspaceInviteUserList from './SharedspaceInviteSendUserList';
import { useSharedspace } from 'Src/hooks/queries/useSharedspace';

interface SharedspaceInviteMainProps {
  query: string,
};

const SharedspaceInviteMain: FC<SharedspaceInviteMainProps> = ({ query }) => {
  const { data: searchUsersData, nextPage: searchUsersNextPage } = useSearchUsers(query);
  const { data: spaceData } = useSharedspace();

  return (
    <>
    {
      query ?
        <SharedspaceInviteUserList
          query={query}
          isOwner={spaceData.permission.isOwner}
          searchUsersData={searchUsersData}
          nextPage={searchUsersNextPage} />
        :
        <SearchInit />
    }
    </>
  );
};

export default SharedspaceInviteMain;