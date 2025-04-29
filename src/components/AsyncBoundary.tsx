import React, { ErrorInfo, FC, Suspense } from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';

interface AsyncBoundaryProps {
  errorBoundaryFallback: (errors: FallbackProps, errorRenderComponent?: React.ReactNode) => React.ReactNode;
  errorComponent?: React.ReactNode,
  suspenseFallback: React.ReactNode;
  onError?: (error: Error, info: ErrorInfo) => void;
  onReset?: (
    details:
      | { reason: "imperative-api"; args: any[] }
      | { reason: "keys"; prev: any[] | undefined; next: any[] | undefined }
  ) => void;
  errorRenderComponent?: React.ReactNode;
  children: React.ReactNode;
};

const AsyncBoundary: FC<AsyncBoundaryProps> = ({
  errorBoundaryFallback,
  suspenseFallback,
  onError,
  onReset,
  errorRenderComponent,
  children,
}) => {
  return (
    <ErrorBoundary
      FallbackComponent={(error) => errorBoundaryFallback(error, errorRenderComponent)}
      onError={onError}
      onReset={onReset}>
      <Suspense fallback={suspenseFallback}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
};

export default AsyncBoundary;