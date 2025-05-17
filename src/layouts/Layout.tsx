import React, { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import RenderModal from 'Components/modal/RenderModal';

const Layout: FC = () => {
  return (
    <>
      <Outlet />
      <ToastContainer />
      <RenderModal />
    </>
  );
};

export default Layout;