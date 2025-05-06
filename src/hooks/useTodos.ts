import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { useAppSelector } from './reduxHooks';
import { useEffect } from 'react';
import { TTodo } from 'Typings/types';
import { getTodosByDate } from 'Api/todosApi';
import { GET_TODOS_KEY } from 'Lib/queryKeys';

type TypeSafeReturnType = {
  data: TTodo[];
};

type FetchStateReturnType = {
  data: TTodo[] | undefined;
  isLoading: boolean;
  error: unknown;
};

function useTodos(options: { suspense: true, throwOnError: true }): TypeSafeReturnType;
function useTodos(options?: { suspense: boolean, throwOnError: boolean }): FetchStateReturnType;

function useTodos(options = { suspense: false, throwOnError: false }) {
  const { url: _url } = useParams();
  const { todoTime } = useAppSelector(state => state.todoTime);
  const { suspense, throwOnError } = options;
  
  const {
    data,
    isLoading,
    refetch,
    error,
  } = useQuery<TTodo[]>({
    queryKey: [GET_TODOS_KEY],
    queryFn: () => getTodosByDate(_url, todoTime),
    refetchOnWindowFocus: false,
    suspense,
    useErrorBoundary: throwOnError,
  });

  useEffect(() => {
    refetch();
  }, [_url, todoTime]);

  if (suspense) {
    if (isLoading) throw new Promise(() => {});
    if (error) throw error;
    if (!data) throw new Error();

    return { data };
  }

  return {
    data,
    isLoading,
    error,
  };
}

export default useTodos;