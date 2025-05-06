import React, { useEffect } from 'react';
import { defaultToastOption } from 'Lib/noticeConstants';
import { FallbackProps } from "react-error-boundary";
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

export default function GenericErrorFallback({ error, resetErrorBoundary }: FallbackProps, ErrorRenderComponent?: React.ReactNode) {
  useEffect(() => {
    const errorMessage = error instanceof AxiosError && error.response?.data?.message ?
      error.response.data.message :
      '';

    const delay = setTimeout(() => {
      if (errorMessage) {
        toast.error(errorMessage, {
          ...defaultToastOption,
        });
      }
    }, 500);

    return () => {
      clearTimeout(delay);
      resetErrorBoundary();
    };
  }, []);
  
  return <>{ErrorRenderComponent ? ErrorRenderComponent : <></>}</>;
}