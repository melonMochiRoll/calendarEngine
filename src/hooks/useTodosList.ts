import { useQuery } from '@tanstack/react-query';
import { getTodosCount } from 'Api/todosApi';
import { GET_TODOS_LIST_KEY } from 'Constants/queryKeys';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector } from './reduxHooks';

export type TTodosList = {
  [key: string]: number,
};

type TypeSafeReturnType = {
  data: TTodosList;
};

type FetchStateReturnType = {
  data: TTodosList | undefined;
  isLoading: boolean;
  error: unknown;
};

function useTodosList(options: { suspense: true, throwOnError: true }): TypeSafeReturnType;
function useTodosList(options?: { suspense: boolean, throwOnError: boolean }): FetchStateReturnType;

function useTodosList(options = { suspense: false, throwOnError: false }) {
  const { url: _url } = useParams();
  const {
    calendarYear,
    calendarMonth,
  } = useAppSelector(state => state.calendarTime);
  const { suspense, throwOnError } = options;
  
  const {
    data,
    isLoading,
    refetch,
    error,
  } = useQuery<TTodosList>({
    queryKey: [GET_TODOS_LIST_KEY],
    queryFn: () => getTodosCount(_url, calendarYear, calendarMonth),
    refetchOnWindowFocus: false,
    suspense,
    useErrorBoundary: throwOnError,
  });

  useEffect(() => {
    refetch();
  }, [_url, calendarYear, calendarMonth]);

  if (suspense) {
    if (isLoading) throw new Promise(() => {});
    if (error) throw error;
    if (!data) throw new Error();

    return { data };
  }

  return { data, isLoading, error };
}

export default useTodosList;