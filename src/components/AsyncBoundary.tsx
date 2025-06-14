import React, { FC, Suspense } from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';

interface AsyncBoundaryProps {
  errorBoundaryFallback?: (errors: FallbackProps, errorRenderComponent?: React.ReactNode) => React.ReactNode;
  errorRenderComponent?: React.ReactNode;
  suspenseFallback: React.ReactNode;
  children: React.ReactNode;
};

const AsyncBoundary: FC<AsyncBoundaryProps> = ({
  errorBoundaryFallback,
  errorRenderComponent,
  suspenseFallback,
  children,
}) => {
  if (!errorBoundaryFallback) {
    return (
      <ErrorBoundary
        fallbackRender={() => errorRenderComponent}>
        <Suspense fallback={suspenseFallback}>
          {children}
        </Suspense>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary
      FallbackComponent={(error) => errorBoundaryFallback(error, errorRenderComponent)}>
      <Suspense fallback={suspenseFallback}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
};

export default AsyncBoundary;