import React, { FC } from 'react';
import styled from '@emotion/styled';
import { useInvites } from 'Src/hooks/queries/useInvites';
import SharedspaceInviteReceivedInit from './SharedspaceInviteReceivedInit';
import SharedspaceInviteReceivedList from './SharedspaceInviteReceivedList';

interface SharedspaceInviteReceivedMainProps {};

const SharedspaceInviteReceivedMain: FC<SharedspaceInviteReceivedMainProps> = ({}) => {
  const { data: invitesData, loadMore } = useInvites();

  return (
    <>
      {
        invitesData.invites.length ?
          <SharedspaceInviteReceivedList
            invitesData={invitesData}
            loadMore={loadMore} />
          :
          <SharedspaceInviteReceivedInit />
      }
    </>
  );
};

export default SharedspaceInviteReceivedMain;