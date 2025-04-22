import { useQuery } from '@tanstack/react-query';
import { getTodosCount } from 'Api/todosApi';
import { GET_TODOS_LIST_KEY } from 'Lib/queryKeys';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector } from './reduxHooks';

export type TTodosList = {
  [key: string]: number,
};

const useTodosList = () => {
  const { url: _url } = useParams();
  const {
    calendarYear,
    calendarMonth,
  } = useAppSelector(state => state.calendarTime);
  
  const {
    data,
    isLoading,
    refetch,
    error,
  } = useQuery<TTodosList>({
    queryKey: [GET_TODOS_LIST_KEY],
    queryFn: () => getTodosCount(_url, calendarYear, calendarMonth),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    refetch();
  }, [_url, calendarYear, calendarMonth]);

  return {
    data,
    isLoading,
    error,
  } as const;
};

export default useTodosList;