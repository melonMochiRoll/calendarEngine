import React, { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import RenderModal from 'Components/modal/RenderModal';
import { useCsrfToken } from 'Src/hooks/queries/useCsrfToken';
import { ErrorBoundary } from 'react-error-boundary';
import GlobalErrorFallback from 'Src/components/async/GlobalErrorFallback';

const Layout: FC = () => {
  useCsrfToken();

  return (
    <ErrorBoundary fallbackRender={(props) => <GlobalErrorFallback errorProps={props} />}>
      <Outlet />
      <ToastContainer />
      <RenderModal />
    </ErrorBoundary>
  );
};

export default Layout;