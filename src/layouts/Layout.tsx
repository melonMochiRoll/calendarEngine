import React, { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import RenderModal from 'Components/modal/RenderModal';
import NestedModal from 'Components/modal/NestedModal';

const Layout: FC = () => {
  return (
    <>
      <Outlet />
      <ToastContainer />
      <RenderModal />
      <NestedModal />
    </>
  );
};

export default Layout;