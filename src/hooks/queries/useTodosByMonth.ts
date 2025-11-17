import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../reduxHooks";
import { getTodosByMonth } from "Src/api/todosApi";
import { GET_TODOS_BY_MONTH_KEY } from "Src/constants/queryKeys";
import { TTodoMap } from "Src/typings/types";

type UseTodosByMonthReturnType = {
  data: TTodoMap,
};

export function useTodosByMonth(): UseTodosByMonthReturnType {
  const { url: _url } = useParams();
  const {
    calendarYear,
    calendarMonth,
  } = useAppSelector(state => state.calendarTime);

  const {
    data,
    isLoading,
    error,
  } = useQuery<TTodoMap>({
    queryKey: [GET_TODOS_BY_MONTH_KEY, _url, calendarYear, calendarMonth],
    queryFn: () => getTodosByMonth(_url, calendarYear, calendarMonth),
    refetchOnWindowFocus: false,
    suspense: true,
    useErrorBoundary: true,
  });

  if (isLoading) throw new Promise(() => {});
  if (error) throw error;
  if (data === null || data === undefined) throw new Error();

  return { data };
}