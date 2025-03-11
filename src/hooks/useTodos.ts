import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { useAppSelector } from './reduxHooks';
import { useEffect } from 'react';
import { TTodo } from 'Typings/types';
import { getTodosByDate } from 'Api/todosApi';
import { GET_TODOS_KEY } from 'Lib/queryKeys';

type UseTodosReturnType = {
  data: TTodo[],
  isLoading: boolean,
  error: unknown,
}

const useTodos = (): UseTodosReturnType => {
  const { url = '' } = useParams();
  const { todoTime } = useAppSelector(state => state.todoTime);
  
  const {
    data,
    isLoading,
    refetch,
    error,
  } = useQuery({
    queryKey: [GET_TODOS_KEY],
    queryFn: () => getTodosByDate(url, todoTime),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    refetch();
  }, [url, todoTime]);

  return {
    data,
    isLoading,
    error,
  };
};

export default useTodos;