import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { useAppSelector } from 'Hooks/reduxHooks';
import { TTodo } from 'Typings/types';
import { getTodosByDate } from 'Api/todosApi';
import { GET_TODOS_KEY } from 'Constants/queryKeys';
import { handleRetry } from 'Lib/utilFunction';

type UseTodosReturnType = {
  data: TTodo[];
};

export function useTodos(): UseTodosReturnType {
  const { url: _url } = useParams();
  const { todoTime } = useAppSelector(state => state.todoTime);
  
  const {
    data,
    isLoading,
    error,
  } = useQuery<TTodo[]>({
    queryKey: [GET_TODOS_KEY, _url, todoTime],
    queryFn: () => getTodosByDate(_url, todoTime),
    refetchOnWindowFocus: false,
    suspense: true,
    useErrorBoundary: true,
    retry: (failureCount, error) => handleRetry([ 400, 401, 403, 404 ], failureCount, error),
  });

  if (isLoading) throw new Promise(() => {});
  if (error) throw error;
  if (!data) throw new Error();

  return { data };
}