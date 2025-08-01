import React, { FC, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import RenderModal from 'Components/modal/RenderModal';
import { useCsrfToken } from 'Src/hooks/queries/useCsrfToken';
import ModalLoadingCircular from 'Src/components/skeleton/ModalLoadingCircular';

const Layout: FC = () => {
  useCsrfToken();

  return (
    <>
      <Outlet />
      <ToastContainer />
      <Suspense fallback={<ModalLoadingCircular />}>
        <RenderModal />
      </Suspense>
    </>
  );
};

export default Layout;