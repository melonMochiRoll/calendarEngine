import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import 'Styles/GlobalStyle.css';
import MainRouter from 'Routes/MainRouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux'
import { reduxStore } from './store';
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import customParseFormat from 'dayjs/plugin/customParseFormat';
import LoadingPage from './components/async/skeleton/LoadingPage';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrAfter);
dayjs.extend(customParseFormat);

const rootNode = document.getElementById('root') as HTMLElement;
const queryClient = new QueryClient();

createRoot(rootNode).render(
  <React.StrictMode>
    <Provider store={reduxStore}>
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<LoadingPage />}>
        <RouterProvider router={MainRouter} />
      </Suspense>
    </QueryClientProvider>
    </Provider>
  </React.StrictMode>
);