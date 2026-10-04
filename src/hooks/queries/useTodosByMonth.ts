import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../reduxHooks";
import { getTodosByMonth } from "Src/api/todosApi";
import { GET_TODOS_BY_MONTH_KEY } from "Src/constants/queryKeys";
import { TTodoMap } from "Src/typings/types";
import { handleRetry } from "Src/lib/utilFunction";

export function useTodosByMonth() {
  const { SharedspaceId: _SharedspaceId } = useParams();
  const {
    calendarYear,
    calendarMonth,
  } = useAppSelector(state => state.calendarTime);

  const { data } = useSuspenseQuery<TTodoMap>({
    queryKey: [GET_TODOS_BY_MONTH_KEY, _SharedspaceId, calendarYear, calendarMonth],
    queryFn: () => getTodosByMonth(_SharedspaceId, calendarYear, calendarMonth),
    retry: (failureCount, error) => handleRetry([ 400, 401, 403, 404 ], failureCount, error),
  });

  return { data } as const;
}