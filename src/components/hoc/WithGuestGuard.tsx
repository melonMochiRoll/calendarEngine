import React, { useEffect } from 'react';
import useUser from 'Hooks/queries/useUser';
import { useNavigate } from 'react-router-dom';
import { PATHS } from 'Constants/paths';

const WithGuestGuard = <P extends {}>(WrappedComponent: React.FunctionComponent<P>) => {
  return (props: P) => {
    const navigate = useNavigate();
    const { isLogin } = useUser({ suspense: false, throwOnError: false });

    useEffect(() => {
      if (isLogin) {
        navigate(PATHS.SHAREDSPACE);
      }
    }, [isLogin]);
      
    return <WrappedComponent {...props} />;
  }
}

export default WithGuestGuard;