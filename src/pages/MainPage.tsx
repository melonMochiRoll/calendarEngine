import React, { FC, Suspense } from 'react';
import styled from '@emotion/styled';
import SkeletonHeader from 'Src/components/async/skeleton/SkeletonHeader';
import Header from 'Src/layouts/Header';
import { ErrorBoundary } from 'react-error-boundary';
import LoadingPage from 'Src/components/async/skeleton/LoadingPage';
import SharedspaceFallback from 'Src/components/async/fallbackUI/SharedspaceFallback';
import SubscribedSpacesContainer from 'Src/containers/SubscribedSpacesContainer';

const MainPage: FC = () => {
  return (
    <Block>
      <Suspense fallback={<SkeletonHeader />}>
        <Header />
      </Suspense>
      <ErrorBoundary fallbackRender={(props) => <SharedspaceFallback errorProps={props} />}>
        <Suspense fallback={<LoadingPage />}>
          <SubscribedSpacesContainer />
        </Suspense>
      </ErrorBoundary>
    </Block>
  );
};

export default MainPage;

const Block = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;