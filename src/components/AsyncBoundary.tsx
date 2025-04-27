import React, { FC, Suspense } from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';

interface AsyncBoundaryProps {
  errorBoundaryFallback?: React.ComponentType<FallbackProps>;
  errorComponent?: React.ReactNode,
  suspenseFallback: React.ReactNode;
  children: React.ReactNode;
};

const AsyncBoundary: FC<AsyncBoundaryProps> = ({
  errorBoundaryFallback = () => null,
  errorComponent = null,
  suspenseFallback,
  children,
}) => {
  if (errorComponent) {
    return (
      <ErrorBoundary fallback={errorComponent}>
        <Suspense fallback={suspenseFallback}>
          {children}
        </Suspense>
      </ErrorBoundary>
    );
  }
  
  return (
    <ErrorBoundary FallbackComponent={errorBoundaryFallback}>
      <Suspense fallback={suspenseFallback}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
};

export default AsyncBoundary;