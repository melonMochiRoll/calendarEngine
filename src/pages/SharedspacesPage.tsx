import React, { FC, Suspense } from 'react';
import styled from '@emotion/styled';
import SubscribedSpacesContainer from 'Containers/SubscribedSpacesContainer';
import { ErrorBoundary } from 'react-error-boundary';
import CommonFallback from 'Src/components/async/fallbackUI/CommonFallback';
import LoadingPage from 'Src/components/async/skeleton/LoadingPage';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';

const SharedspacesPage: FC = () => {
  const location = useLocation();
  const { reset } = useQueryErrorResetBoundary();
  
  return (
    <ErrorBoundary
      onReset={reset}
      resetKeys={[location.pathname]}
      fallbackRender={(props) => <CommonFallback errorProps={props} />}>
      <Suspense fallback={<LoadingPage />}>
        <SubscribedSpacesContainer />
      </Suspense>
    </ErrorBoundary>
  );
};

export default SharedspacesPage;