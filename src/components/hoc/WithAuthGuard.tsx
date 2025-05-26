import React, { useEffect } from 'react';
import useUser from 'Hooks/queries/useUser';
import { defaultToastOption, needLogin } from 'Constants/notices';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { PATHS } from 'Constants/paths';

const WithAuthGuard = <P extends {}>(WrappedComponent: React.FunctionComponent<P>) => {
  return (props: P) => {
    const navigate = useNavigate();
    const { isNotLogin } = useUser({ suspense: false, throwOnError: false });

    useEffect(() => {
      const delay = setTimeout(() => {
        if (isNotLogin) {
          toast.error(needLogin, {
            ...defaultToastOption,
          });
          navigate(PATHS.LOGIN);
        }
      }, 500);

      return () => {
        clearTimeout(delay);
      };
    }, [isNotLogin]);
      
    return <WrappedComponent {...props} />;
  }
}

export default WithAuthGuard;