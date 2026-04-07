import React, { FC } from 'react';
import styled from '@emotion/styled';
import { useSearchUsers } from 'Src/hooks/queries/useSearchUsers';
import SharedspaceInviteUserList from './SharedspaceInviteSendUserList';
import { useSharedspace } from 'Src/hooks/queries/useSharedspace';
import SearchIcon from '@mui/icons-material/SearchRounded';

interface SharedspaceInviteMainProps {
  query: string,
};

const SharedspaceInviteMain: FC<SharedspaceInviteMainProps> = ({ query }) => {
  const { data: searchUsersData, nextPage: searchUsersNextPage } = useSearchUsers(query);
  const { data: spaceData } = useSharedspace();

  return (
    <Main>
    {
      query ?
        <SharedspaceInviteUserList
          query={query}
          isOwner={spaceData.permission.isOwner}
          searchUsersData={searchUsersData}
          nextPage={searchUsersNextPage} />
        :
        <SearchIcon sx={{ color: 'var(--light-gray)', fontSize: '250px' }} />
    }
    </Main>
  );
};

export default SharedspaceInviteMain;

const Main = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 85%;
`;