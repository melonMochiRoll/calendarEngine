import React, { FC } from 'react';
import styled from '@emotion/styled';
import JoinRequestManagerHeader from './JoinRequestManagerHeader';
import JoinRequestManagerMain from './JoinRequestManagerMain';
import AsyncBoundary from 'Components/AsyncBoundary';
import GenericErrorFallback from 'Components/errors/GenericErrorFallback';
import LoadingCircular from 'Components/skeleton/LoadingCircular';
import SharedspaceManagerError from '../sharedspaceManager/SharedspaceManagerError';

const JoinRequestManagerModal: FC = () => { 
  return (
    <Block onClick={e => e.stopPropagation()}>
      <JoinRequestManagerHeader />
      <AsyncBoundary
        errorBoundaryFallback={GenericErrorFallback}
        suspenseFallback={<LoadingCircular />}
        errorRenderComponent={<SharedspaceManagerError message={'에러가 발생했습니다.'} />}>
        <JoinRequestManagerMain />
      </AsyncBoundary>
    </Block>
  );
};

export default JoinRequestManagerModal;

const Block = styled.div`
  display: flex;
  flex-direction: column;
  width: 650px;
  height: 500px;
  border-radius: 15px;
  background-color: var(--black);
  box-shadow: 1px 1px 10px 2px #000;
`;