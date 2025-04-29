import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { PATHS } from 'Constants/paths';

const Layout = React.lazy(() => import('../layouts/Layout'));
const MainPage = React.lazy(() => import('../pages/MainPage'));
const LoginPage = React.lazy(() => import('../pages/LoginPage'));
const JoinPage = React.lazy(() => import('../pages/JoinPage'));
const SharedspacesPage = React.lazy(() => import('../pages/SharedspacesPage'));
const SharedspacesLayout = React.lazy(() => import('../layouts/SharedspacesLayout'));
const SharedspacesViewPage = React.lazy(() => import('../pages/SharedspacesViewPage'));
const SharedspacesChatPage = React.lazy(() => import('../pages/SharedspacesChatPage'));
const NotFoundPage = React.lazy(() => import('../pages/errorPage/NotFoundPage'));
const InternalServerErrorPage = React.lazy(() => import('../pages/errorPage/InternalServerErrorPage'));
const ForbiddenPage = React.lazy(() => import('../pages/errorPage/ForbiddenPage'));

const MainRouter = createBrowserRouter([
  {
    path: PATHS.HOME,
    element: <Layout />,
    children: [
      { index: true, element: <MainPage /> },
      { path: PATHS.LOGIN, element: <LoginPage /> },
      { path: PATHS.JOIN, element: <JoinPage /> },
      {
        path: PATHS.SHAREDSPACE,
        children: [
          { index: true, element: <SharedspacesPage /> },
          {
            element: <SharedspacesLayout />,
            children: [
              { path: 'view/:url', element: <SharedspacesViewPage /> },
              { path: 'chat/:url', element: <SharedspacesChatPage /> },
            ],
          }
        ],
      },
      { path: PATHS.FORBIDDEN, element: <ForbiddenPage /> },
      { path: PATHS.NOTFOUND, element: <NotFoundPage /> },
      { path: PATHS.INTERNAL, element: <InternalServerErrorPage /> },
      { path: '*', element: <NotFoundPage /> }
    ],
  },
]);

export default MainRouter;