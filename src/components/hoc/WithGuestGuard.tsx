import React, { useEffect } from 'react';
import useUser from 'Hooks/useUser';
import { useNavigate } from 'react-router-dom';
import { PATHS } from 'Constants/paths';

const WithGuestGuard = <P extends {}>(WrappedComponent: React.FunctionComponent<P>) => {
  return (props: P) => {
    const navigate = useNavigate();
    const { userData, isLogin } = useUser();

    useEffect(() => {
      if (isLogin) {
        navigate(PATHS.SHAREDSPACE);
      }
    }, [userData, isLogin]);
      
    return <WrappedComponent {...props} />;
  }
}

export default WithGuestGuard;