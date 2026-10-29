import React, { FC, Suspense } from 'react';
import styled from '@emotion/styled';
import SharedspaceInviteReceivedHeader from './SharedspaceInviteReceivedHeader';
import ModalLoadingCircular from 'Src/components/async/skeleton/ModalLoadingCircular';
import SharedspaceInviteReceivedMain from './SharedspaceInviteReceivedMain';

interface SharedspaceInviteReceivedModalProps {};

const SharedspaceInviteReceivedModal: FC<SharedspaceInviteReceivedModalProps> = ({}) => {
  return (
    <Block onClick={e => e.stopPropagation()}>
      <SharedspaceInviteReceivedHeader />
      <Suspense fallback={<ModalLoadingCircular />}>
        <SharedspaceInviteReceivedMain />
      </Suspense>
    </Block>
  );
};

export default SharedspaceInviteReceivedModal;

const Block = styled.div`
  display: flex;
  flex-direction: column;
  width: 650px;
  height: 500px;
  border: 1px solid #1d2126;
  border-radius: 15px;
  background-color: var(--black);
  box-shadow: 1px 1px 10px 2px #000;
`;