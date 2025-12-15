import React, { FC, Suspense } from 'react';
import RequireLogin from 'Src/components/guard/RequireLogin';
import LoadingPage from 'Src/components/skeleton/LoadingPage';
import JoinRequestSenderContainer from 'Src/containers/JoinRequestSenderContainer';

const JoinRequestSenderPage: FC = () => {
  return (
    <Suspense fallback={<LoadingPage />}>
      <RequireLogin>
        <JoinRequestSenderContainer />
      </RequireLogin>
    </Suspense>
  );
};

export default JoinRequestSenderPage;