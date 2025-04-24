import React, { useEffect } from 'react';
import useSharedspace from 'Hooks/useSharedspace';
import useUser from 'Hooks/useUser';
import { defaultToastOption, needLogin, privateTooltip, waitingMessage } from 'Lib/noticeConstants';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { PATHS } from 'Constants/paths';

const WithSharedspaceRedirect = <P extends {}>(WrappedComponent: React.FunctionComponent<P>) => {
  return (props: P) => {
    const navigate = useNavigate();
    const { isLogin, isNotLogin } = useUser();
    const { isLoading, error, errorCode } = useSharedspace();

    useEffect(() => {
      if (!isLoading && error) {
        const response = {
          message: waitingMessage,
          destination: PATHS.INTERNAL,
        };
        
        if (errorCode === 403 && isLogin) {
          response.message = privateTooltip;
          response.destination = PATHS.FORBIDDEN;
        }
  
        if (errorCode === 403 && isNotLogin) {
          response.message = needLogin;
          response.destination = PATHS.LOGIN;
        }
  
        toast.error(response.message, {
          ...defaultToastOption,
        });
        navigate(response.destination);
      }
    }, [error]);
      
    return <WrappedComponent {...props} />;
  }
}

export default WithSharedspaceRedirect;