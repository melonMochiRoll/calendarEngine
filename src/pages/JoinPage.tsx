import React, { FC, Suspense } from 'react';
import JoinContainer from 'Containers/JoinContainer';
import LoadingPage from 'Src/components/async/skeleton/LoadingPage';
import RequireLogout from 'Src/components/guard/RequireLogout';

const JoinPage: FC = () => {
  return (
    <Suspense fallback={<LoadingPage />}>
      <RequireLogout>
        <JoinContainer />
      </RequireLogout>
    </Suspense>
  );
};

export default JoinPage;