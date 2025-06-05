import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import 'Styles/GlobalStyle.css';
import MainRouter from 'Routes/MainRouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux'
import { reduxStore } from './store';
import SkeletonSharedspacePage from 'Components/SkeletonSharedspacePage';

const rootNode = document.getElementById('root') as HTMLElement;
const queryClient = new QueryClient();

createRoot(rootNode).render(
  <React.StrictMode>
    <Provider store={reduxStore}>
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<SkeletonSharedspacePage />}>
        <RouterProvider router={MainRouter} />
      </Suspense>
    </QueryClientProvider>
    </Provider>
  </React.StrictMode>
);