import React, { FC } from "react";
import { PATHS } from "Constants/paths";
import { FallbackProps } from "react-error-boundary";

interface GlobalErrorFallbackProps {
  errorProps: FallbackProps,
};

const GlobalErrorFallback: FC<GlobalErrorFallbackProps> = ({ errorProps }) => {
  const { error, resetErrorBoundary } = errorProps;
  let status = error?.response?.status || 500;
  let destination = PATHS.INTERNAL;

  if (status === 400) {
    destination = PATHS.SHAREDSPACE;
  }

  if (status === 401) {
    destination = PATHS.LOGIN;
  }

  if (status === 403) {
    destination = error?.response?.data?.metaData?.SharedspaceId ?
      `${PATHS.JOINREQUEST_SENDER}/${error?.response?.data?.metaData?.SharedspaceId}` :
      PATHS.HOME;
  }

  if (status === 404) {
    destination = PATHS.NOTFOUND;
  }

  window.location.href = destination;
  return <></>;
};

export default GlobalErrorFallback;