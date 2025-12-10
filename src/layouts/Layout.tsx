import React, { FC, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import RenderModal from 'Components/modal/RenderModal';
import { useCsrfToken } from 'Src/hooks/queries/useCsrfToken';
import ModalLoadingCircular from 'Src/components/skeleton/ModalLoadingCircular';
import { ErrorBoundary } from 'react-error-boundary';
import GlobalErrorFallback from 'Src/components/errors/GlobalErrorFallback';

const Layout: FC = () => {
  useCsrfToken();

  return (
    <ErrorBoundary fallbackRender={GlobalErrorFallback}>
      <Outlet />
      <ToastContainer />
      <Suspense fallback={<ModalLoadingCircular />}>
        <RenderModal />
      </Suspense>
    </ErrorBoundary>
  );
};

export default Layout;