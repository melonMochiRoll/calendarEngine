import React, { useEffect } from 'react';
import useUser from 'Hooks/useUser';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { defaultToastOption, needLogin, privateTooltip, waitingMessage } from 'Constants/notices';
import { PATHS } from 'Constants/paths';
import { AxiosError } from 'axios';
import { FallbackProps } from 'react-error-boundary';

export default function SharedspaceRedirectFallback({ error, resetErrorBoundary }: FallbackProps, ErrorRenderComponent?: React.ReactNode) {
  const navigate = useNavigate();
  const { url } = useParams();
  const { isLogin, isNotLogin } = useUser({ suspense: false, throwOnError: false });
  const isAxiosError = error instanceof AxiosError
  const errorCode = isAxiosError ? error.response?.status : 500;

  useEffect(() => {
    const response = {
      message: waitingMessage,
      destination: PATHS.INTERNAL,
    };
    
    if (errorCode === 403 && isLogin) {
      response.message = privateTooltip;
      response.destination = `${PATHS.JOINREQUEST_SENDER}/${url}`;
    }
  
    if (errorCode === 403 && isNotLogin) {
      response.message = needLogin;
      response.destination = PATHS.LOGIN;
    }

    const delay = setTimeout(() => {
      toast.error(response.message, {
        ...defaultToastOption,
      });
      navigate(response.destination);
    }, 500);

    return () => {
      clearTimeout(delay);
    };
  }, []);

  return (
    <>{ErrorRenderComponent ? ErrorRenderComponent : <></>}</>
  );
}