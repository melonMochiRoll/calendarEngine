import React, { FC } from 'react';
import styled from '@emotion/styled';
import { useInvites } from 'Src/hooks/queries/useInvites';
import SharedspaceInviteReceivedInit from './SharedspaceInviteReceivedInit';
import SharedspaceInviteReceivedList from './SharedspaceInviteReceivedList';
import { useInView } from 'Src/hooks/utils/useInView';

interface SharedspaceInviteReceivedMainProps {};

const SharedspaceInviteReceivedMain: FC<SharedspaceInviteReceivedMainProps> = ({}) => {
  const {
    data: invitesData,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isFetchNextPageError,
  } = useInvites();

  const sentinelRef = useInView(() => fetchNextPage(), {
    enable: hasNextPage && !isFetchingNextPage && !isFetchNextPageError,
    rootMargin: '100px 0px 0px 0px',
  });

  const invites = invitesData.pages.flatMap(page => page.invites);

  return (
    <>
      {
        invites.length ?
          <SharedspaceInviteReceivedList
            invites={invites}
            sentinelRef={sentinelRef}
            hasNextPage={hasNextPage}
            fetchNextPage={fetchNextPage}
            isFetchingNextPage={isFetchingNextPage}
            isFetchNextPageError={isFetchNextPageError} />
          :
          <SharedspaceInviteReceivedInit />
      }
    </>
  );
};

export default SharedspaceInviteReceivedMain;