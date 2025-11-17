import React, { FC } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import GlobalErrorFallback from 'Src/components/errors/GlobalErrorFallback';
import SharedspaceContainer from 'Src/containers/SharedspaceContainer';

interface SharedspacesLayoutProps {};

const SharedspacesLayout: FC<SharedspacesLayoutProps> = ({}) => {
  return (
    <ErrorBoundary
      fallbackRender={GlobalErrorFallback}>
      <SharedspaceContainer />
    </ErrorBoundary>
  );
};

export default SharedspacesLayout;