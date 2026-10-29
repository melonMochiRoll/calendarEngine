import React, { FC, Suspense } from 'react';
import CalendarContainer from 'Containers/CalendarContainer';
import LoadingPage from 'Src/components/async/skeleton/LoadingPage';

const SharedspacesViewPage: FC = () => {
  return (
    <Suspense fallback={<LoadingPage />}>
      <CalendarContainer />
    </Suspense>
  );
};

export default SharedspacesViewPage;