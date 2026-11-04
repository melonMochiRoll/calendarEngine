import React, { FC } from 'react';
import styled from '@emotion/styled';
import { useInvites } from 'Src/hooks/queries/useInvites';
import SharedspaceInviteReceivedInit from './SharedspaceInviteReceivedInit';
import SharedspaceInviteReceivedList from './SharedspaceInviteReceivedList';

interface SharedspaceInviteReceivedMainProps {};

const SharedspaceInviteReceivedMain: FC<SharedspaceInviteReceivedMainProps> = ({}) => {
  const {
    data: invitesData,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isFetchNextPageError,
  } = useInvites();

  const invites = invitesData.pages.flatMap(page => page.invites);

  return (
    <>
      {
        invites.length ?
          <SharedspaceInviteReceivedList
            invites={invites}
            hasNextPage={hasNextPage}
            fetchNextPage={fetchNextPage} />
          :
          <SharedspaceInviteReceivedInit />
      }
    </>
  );
};

export default SharedspaceInviteReceivedMain;