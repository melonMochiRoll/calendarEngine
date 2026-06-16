import React, { FC, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import RenderModal from 'Components/modal/RenderModal';
import { useCsrfToken } from 'Src/hooks/queries/useCsrfToken';
import { ErrorBoundary } from 'react-error-boundary';
import GlobalErrorFallback from 'Src/components/async/GlobalErrorFallback';
import { refreshAuthToken } from 'Src/api/authApi';
import { useAppDispatch } from 'Src/hooks/reduxHooks';
import { setAccessToken } from 'Src/features/accessTokenSlice';
import LoadingPage from 'Src/components/async/skeleton/LoadingPage';

const Layout: FC = () => {
  const dispatch = useAppDispatch();
  const [ accessTokenReady, setAccessTokenReady ] = useState(false);
  useCsrfToken();

  useEffect(() => {
    const initToken = async () => {
      try {
        const { newAccessToken } = await refreshAuthToken();
        dispatch(setAccessToken({ token: newAccessToken }));
      } finally {
        setAccessTokenReady(true);
      }
    };
    initToken();
  }, []);

  if (!accessTokenReady) return <LoadingPage />;

  return (
    <ErrorBoundary fallbackRender={(props) => <GlobalErrorFallback errorProps={props} />}>
      <Outlet />
      <ToastContainer />
      <RenderModal />
    </ErrorBoundary>
  );
};

export default Layout;