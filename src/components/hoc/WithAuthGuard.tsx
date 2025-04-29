import React, { useEffect } from 'react';
import useUser from 'Hooks/useUser';
import { defaultToastOption, needLogin } from 'Lib/noticeConstants';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { PATHS } from 'Constants/paths';

const WithAuthGuard = <P extends {}>(WrappedComponent: React.FunctionComponent<P>) => {
  return (props: P) => {
    const navigate = useNavigate();
    const { data: userData, isNotLogin } = useUser({ suspense: false, throwOnError: false });

    useEffect(() => {
      if (isNotLogin) {
        const delay = setTimeout(() => {
          if (userData) {
            clearTimeout(delay);
          } else {
            toast.error(needLogin, {
              ...defaultToastOption,
            });
            navigate(PATHS.LOGIN);
          }
        }, 500);

        return () => {
          clearTimeout(delay);
        };
      }
    }, [userData, isNotLogin]);
      
    return <WrappedComponent {...props} />;
  }
}

export default WithAuthGuard;