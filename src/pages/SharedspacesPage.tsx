import React, { FC } from 'react';
import styled from '@emotion/styled';
import Header from 'Layouts/Header';
import SubscribedSpacesContainer from 'Containers/SubscribedSpacesContainer';
import WithAuthGuard from 'Components/hoc/WithAuthGuard';
import AsyncBoundary from 'Components/AsyncBoundary';
import SkeletonHeader from 'Components/skeleton/SkeletonHeader';
import { GET_SUBSCRIBED_SPACES_KEY, GET_USER_KEY } from 'Lib/queryKeys';
import { useQueryClient } from '@tanstack/react-query';
import GenericErrorFallback from 'Components/errors/GenericErrorFallback';
import LoadingCircular from 'Components/skeleton/LoadingCircular';

const SharedspacesPage: FC = () => {
  const qc = useQueryClient();
  
  return (
    <Block>
      <AsyncBoundary
        errorBoundaryFallback={GenericErrorFallback}
        suspenseFallback={<SkeletonHeader />}
        onReset={() => {
          qc.removeQueries([GET_USER_KEY]);
        }}>
        <Header />
      </AsyncBoundary>
      <AsyncBoundary
        errorBoundaryFallback={GenericErrorFallback}
        suspenseFallback={<LoadingCircular />}
        onReset={() => {
          qc.removeQueries([GET_USER_KEY]);
          qc.removeQueries([GET_SUBSCRIBED_SPACES_KEY]);
        }}>
        <SubscribedSpacesContainer />
      </AsyncBoundary>
    </Block>
  );
};

export default WithAuthGuard(SharedspacesPage);

const Block = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: var(--black);
`;