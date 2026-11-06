import React, { FC } from 'react';
import styled from '@emotion/styled';
import { useSearchUsers } from 'Src/hooks/queries/useSearchUsers';
import SharedspaceInviteUserList from './SharedspaceInviteSendUserList';
import { useSharedspace } from 'Src/hooks/queries/useSharedspace';
import SearchIcon from '@mui/icons-material/SearchRounded';
import { useInView } from 'Src/hooks/utils/useInView';

interface SharedspaceInviteMainProps {
  query: string,
};

const SharedspaceInviteMain: FC<SharedspaceInviteMainProps> = ({ query }) => {
  const {
    data: searchUsersData,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isFetchNextPageError,
  } = useSearchUsers(query);
  const { data: spaceData } = useSharedspace();

  const sentinelRef = useInView(() => fetchNextPage(), {
    enable: hasNextPage && !isFetchingNextPage && !isFetchNextPageError,
    rootMargin: '100px 0px 0px 0px',
  });

  const searchUsers = searchUsersData.pages.flatMap(page => page.users);

  return (
    <Main>
    {
      query ?
        <SharedspaceInviteUserList
          query={query}
          isOwner={spaceData.permission.isOwner}
          searchUsers={searchUsers}
          sentinelRef={sentinelRef}
          fetchNextPage={fetchNextPage}
          isFetchingNextPage={isFetchingNextPage}
          hasNextPage={hasNextPage}
          isFetchNextPageError={isFetchNextPageError} />
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