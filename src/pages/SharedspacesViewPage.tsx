import React, { FC, Suspense } from 'react';
import CalendarContainer from 'Containers/CalendarContainer';
import { ErrorBoundary } from 'react-error-boundary';
import CommonFallback from 'Src/components/async/fallbackUI/CommonFallback';
import LoadingPage from 'Src/components/async/skeleton/LoadingPage';

const SharedspacesViewPage: FC = () => {
  return (
    <ErrorBoundary fallbackRender={(props) => <CommonFallback errorProps={props}/>}>
      <Suspense fallback={<LoadingPage />}>
        <CalendarContainer />
      </Suspense>
    </ErrorBoundary>
  );
};

export default SharedspacesViewPage;