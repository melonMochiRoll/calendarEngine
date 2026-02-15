import React, { FC } from 'react';
import styled from '@emotion/styled';
import { useInvites } from 'Src/hooks/queries/useInvites';
import SharedspaceInviteReceivedInit from './SharedspaceInviteReceivedInit';
import SharedspaceInviteReceivedList from './SharedspaceInviteReceivedList';
import { acceptInvite, declineInvite } from 'Src/api/inviteApi';
import { useQueryClient } from '@tanstack/react-query';
import { GET_SUBSCRIBED_SPACES_KEY } from 'Src/constants/queryKeys';

interface SharedspaceInviteReceivedMainProps {};

const SharedspaceInviteReceivedMain: FC<SharedspaceInviteReceivedMainProps> = ({}) => {
  const qc = useQueryClient();
  const { data: invitesData, nextPage } = useInvites();

  const handleAcceptInvite = async (id: number, url: string) => {
    await acceptInvite(id, url);
    await qc.refetchQueries([GET_SUBSCRIBED_SPACES_KEY]);
  };

  const handleDeclineInvite = async (id: number, url: string) => {
    await declineInvite(id, url);
  };

  return (
    <>
      {
        invitesData.invites.length ?
          <SharedspaceInviteReceivedList
            invites={invitesData.invites} 
            hasMoreData={invitesData.hasMoreData}
            nextPage={nextPage}
            acceptInvite={handleAcceptInvite}
            declineInvite={handleDeclineInvite} />
          :
          <SharedspaceInviteReceivedInit />
      }
    </>
  );
};

export default SharedspaceInviteReceivedMain;