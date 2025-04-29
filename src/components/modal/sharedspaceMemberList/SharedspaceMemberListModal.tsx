import React, { FC } from 'react';
import styled from '@emotion/styled';
import SharedspaceMemberListHeader from './SharedspaceMemberListHeader';
import SharedspaceMemberListMain from './SharedspaceMemberListMain';
import AsyncBoundary from 'Components/AsyncBoundary';
import GenericErrorFallback from 'Components/errors/GenericErrorFallback';
import LoadingCircular from 'Components/skeleton/LoadingCircular';
import SharedspaceManagerError from '../sharedspaceManager/SharedspaceManagerError';

const SharedspaceMemberListModal: FC = () => {
  return (
    <Block
      onClick={e => e.stopPropagation()}>
      <Main>
        <SharedspaceMemberListHeader />
        <AsyncBoundary
          errorBoundaryFallback={GenericErrorFallback}
          suspenseFallback={<LoadingCircular />}
          errorRenderComponent={<SharedspaceManagerError message={'에러가 발생했습니다.'} />}>
          <SharedspaceMemberListMain />
        </AsyncBoundary>
      </Main>
    </Block>
  );
};

export default SharedspaceMemberListModal;

const Block = styled.div`
  display: flex;
  flex-direction: column;
  width: 650px;
  height: 500px;
  padding-bottom: 1%;
  border-radius: 15px;
  background-color: var(--black);
  box-shadow: 1px 1px 10px 2px #000;
`;

const Main = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 85%;
  color: var(--white);
`;