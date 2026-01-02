import React, { FC, Suspense } from 'react';
import SubscribedSpacesContainer from 'Containers/SubscribedSpacesContainer';
import { ErrorBoundary } from 'react-error-boundary';
import RequireLogin from 'Src/components/guard/RequireLogin';
import SharedspaceFallback from 'Src/components/async/fallbackUI/SharedspaceFallback';
import LoadingPage from 'Src/components/async/skeleton/LoadingPage';

const SharedspacesPage: FC = () => {
  return (
    <ErrorBoundary fallbackRender={(props) => <SharedspaceFallback errorProps={props} />}>
      <Suspense fallback={<LoadingPage />}>
        <RequireLogin>
          <SubscribedSpacesContainer />
        </RequireLogin>
      </Suspense>
    </ErrorBoundary>
  );
};

export default SharedspacesPage;