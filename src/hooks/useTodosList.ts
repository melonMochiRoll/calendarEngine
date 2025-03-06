import { useQuery } from '@tanstack/react-query';
import { getTodosCount } from 'Api/todosApi';
import { GET_TODOS_LIST_KEY } from 'Lib/queryKeys';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector } from './reduxHooks';

export type TTodosList = {
  [key: string]: number,
};

type UseTodosListReturnType = {
  data: TTodosList,
  isLoading: boolean,
  error: unknown,
}

const useTodosList = (): UseTodosListReturnType => {
  const { url = '' } = useParams();
  const {
    calendarYear,
    calendarMonth,
  } = useAppSelector(state => state.calendarTime);
  
  const {
    data,
    isLoading,
    refetch,
    error,
  } = useQuery({
    queryKey: [GET_TODOS_LIST_KEY],
    queryFn: () => getTodosCount(url, calendarYear, calendarMonth),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    refetch();
  }, [url, calendarYear, calendarMonth]);

  return {
    data,
    isLoading,
    error,
  };
};

export default useTodosList;