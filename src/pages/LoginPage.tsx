import React, { FC, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import LoginContainer from 'Containers/LoginContainer';
import { toast } from 'react-toastify';
import { defaultToastOption } from 'Constants/notices';
import WithGuestGuard from 'Components/hoc/WithGuestGuard';

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
    <LoginContainer />
  )
};

export default WithGuestGuard(LoginPage);