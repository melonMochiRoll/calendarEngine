import React, { FC } from 'react';
import styled from '@emotion/styled';
import Header from 'Layouts/Header';
import SubscribedSpacesContainer from 'Containers/SubscribedSpacesContainer';
import WithAuthGuard from 'Components/hoc/WithAuthGuard';
import AsyncBoundary from 'Components/AsyncBoundary';
import SkeletonHeader from 'Components/skeleton/SkeletonHeader';
import GenericErrorFallback from 'Components/errors/GenericErrorFallback';
import LoadingCircular from 'Components/skeleton/LoadingCircular';

const SharedspacesPage: FC = () => {
  return (
    <Background>
      <AsyncBoundary
        errorBoundaryFallback={GenericErrorFallback}
        suspenseFallback={<SkeletonHeader />}>
        <Header />
      </AsyncBoundary>
      <AsyncBoundary
        errorBoundaryFallback={GenericErrorFallback}
        suspenseFallback={<LoadingCircular />}>
        <SubscribedSpacesContainer />
      </AsyncBoundary>
    </Background>
  );
};

export default WithAuthGuard(SharedspacesPage);

const Background = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--black);
`;