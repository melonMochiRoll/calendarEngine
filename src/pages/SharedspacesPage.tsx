import React, { FC, Suspense } from 'react';
import styled from '@emotion/styled';
import SubscribedSpacesContainer from 'Containers/SubscribedSpacesContainer';
import { ErrorBoundary } from 'react-error-boundary';
import RequireLogin from 'Src/components/guard/RequireLogin';
import SharedspaceFallback from 'Src/components/async/fallbackUI/SharedspaceFallback';
import LoadingPage from 'Src/components/async/skeleton/LoadingPage';
import Header from 'Src/layouts/Header';

const SharedspacesPage: FC = () => {
  return (
    <Block>
      <Header />
      <ErrorBoundary fallbackRender={(props) => <SharedspaceFallback errorProps={props} />}>
        <Suspense fallback={<LoadingPage />}>
          <RequireLogin>
            <SubscribedSpacesContainer />
          </RequireLogin>
        </Suspense>
      </ErrorBoundary>
    </Block>
  );
};

export default SharedspacesPage;

const Block = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;