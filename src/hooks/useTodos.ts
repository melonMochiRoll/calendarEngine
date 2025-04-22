import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { useAppSelector } from './reduxHooks';
import { useEffect } from 'react';
import { TTodo } from 'Typings/types';
import { getTodosByDate } from 'Api/todosApi';
import { GET_TODOS_KEY } from 'Lib/queryKeys';

const useTodos = () => {
  const { url: _url } = useParams();
  const { todoTime } = useAppSelector(state => state.todoTime);
  
  const {
    data,
    isLoading,
    refetch,
    error,
  } = useQuery<TTodo[]>({
    queryKey: [GET_TODOS_KEY],
    queryFn: () => getTodosByDate(_url, todoTime),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    refetch();
  }, [_url, todoTime]);

  return {
    data,
    isLoading,
    error,
  } as const;
};

export default useTodos;