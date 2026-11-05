import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { SEARCH_TODOS_KEY } from "Constants/queryKeys";
import { searchTodos } from "Api/todosApi";
import { useParams } from "react-router-dom";
import { handleRetry } from "Lib/utilFunction";

export function useSearchTodos(query: string) {
  const { SharedspaceId: _SharedspaceId } = useParams();

  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isFetchNextPageError,
  } = useSuspenseInfiniteQuery({
    queryKey: [SEARCH_TODOS_KEY, _SharedspaceId, query],
    queryFn: () => searchTodos(_SharedspaceId, query),
    initialPageParam: '',
    getNextPageParam: (lastPage) => lastPage.hasMoreData ? lastPage.todos[lastPage.todos.length-1].id : undefined,
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => handleRetry([ 400, 401, 403, 404 ], failureCount, error),
  });

  return {
    data,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isFetchNextPageError,
  } as const;
}