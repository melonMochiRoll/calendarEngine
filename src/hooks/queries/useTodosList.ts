import { useQuery } from '@tanstack/react-query';
import { getTodosCount } from 'Api/todosApi';
import { GET_TODOS_LIST_KEY } from 'Constants/queryKeys';
import { useParams } from 'react-router-dom';
import { useAppSelector } from 'Hooks/reduxHooks';
import { handleRetry } from 'Lib/utilFunction';

export type TTodosList = {
  [key: string]: number,
};

type UseTodosListReturnType = {
  data: TTodosList;
};

export function useTodosList(): UseTodosListReturnType {
  const { url: _url } = useParams();
  const {
    calendarYear,
    calendarMonth,
  } = useAppSelector(state => state.calendarTime);
  
  const {
    data,
    isLoading,
    error,
  } = useQuery<TTodosList>({
    queryKey: [GET_TODOS_LIST_KEY, _url, calendarYear, calendarMonth],
    queryFn: () => getTodosCount(_url, calendarYear, calendarMonth),
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