import React, { FC, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import RenderModal from 'Components/modal/RenderModal';
import { useCsrfToken } from 'Src/hooks/queries/useCsrfToken';
import LoadingCircular from 'Src/components/skeleton/LoadingCircular';

const Layout: FC = () => {
  useCsrfToken();

  return (
    <>
      <Outlet />
      <ToastContainer />
      <Suspense fallback={<LoadingCircular />}>
        <RenderModal />
      </Suspense>
    </>
  );
};

export default Layout;