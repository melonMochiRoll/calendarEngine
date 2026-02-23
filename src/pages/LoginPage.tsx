import React, { FC, Suspense, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import LoginContainer from 'Containers/LoginContainer';
import { toast } from 'react-toastify';
import { defaultToastOption } from 'Constants/notices';
import LoadingPage from 'Src/components/async/skeleton/LoadingPage';
import RequireLogout from 'Src/components/guard/RequireLogout';

const LoginPage: FC = () => {
  const [ searchParams ] = useSearchParams();

  useEffect(() => {
    if (searchParams.get('error')) {
      toast.error(searchParams.get('error'), {
        ...defaultToastOption
      });
    }
  }, []);

  return (
    <Suspense fallback={<LoadingPage />}>
      <RequireLogout>
        <LoginContainer />
      </RequireLogout>
    </Suspense>
  )
};

export default LoginPage;