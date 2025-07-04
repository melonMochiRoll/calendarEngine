import React, { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import RenderModal from 'Components/modal/RenderModal';
import { useCsrfToken } from 'Src/hooks/queries/useCSRFToken';

const Layout: FC = () => {
  useCsrfToken();

  return (
    <>
      <Outlet />
      <ToastContainer />
      <RenderModal />
    </>
  );
};

export default Layout;