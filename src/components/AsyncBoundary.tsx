import React, { FC, Suspense } from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';

interface AsyncBoundaryProps {
  fallbackRender: (props: FallbackProps) => React.ReactNode;
  suspenseFallback: React.ReactNode;
  children: React.ReactNode;
};

const AsyncBoundary: FC<AsyncBoundaryProps> = ({
  fallbackRender,
  suspenseFallback,
  children,
}) => {
  return (
    <ErrorBoundary fallbackRender={fallbackRender}>
      <Suspense fallback={suspenseFallback}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
};

export default AsyncBoundary;