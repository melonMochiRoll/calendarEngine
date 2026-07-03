import { useQuery, useQueryClient } from "@tanstack/react-query";
import { SEARCH_TODOS_KEY } from "Constants/queryKeys";
import { searchTodos } from "Api/todosApi";
import { useCallback } from "react";
import { TSearchTodosPayload } from "Typings/types";
import { useParams } from "react-router-dom";
import { handleRetry } from "Lib/utilFunction";

export function useSearchTodos(query: string) {
  const qc = useQueryClient();
  const { url: _url } = useParams();

  const {
    data,
    isLoading,
    error,
  } = useQuery<TSearchTodosPayload>({
    queryKey: [SEARCH_TODOS_KEY, _url, query],
    queryFn: () => searchTodos(_url, query),
    refetchOnWindowFocus: false,
    suspense: true,
    useErrorBoundary: true,
    retry: (failureCount, error) => handleRetry([ 400, 403, 404 ], failureCount, error),
  });

  if (isLoading) throw new Promise(() => {});
  if (error) throw error;
  if (data === null || data === undefined) throw new Error();

  const loadMore = useCallback(async () => {
    const moreTodos = await searchTodos(_url, query, data.todos[data.todos.length-1].id);

    qc.setQueryData<TSearchTodosPayload>([SEARCH_TODOS_KEY, _url], (prev) => {
      if (!prev) return;

      return {
        todos: [ ...prev.todos, ...moreTodos.todos ],
        hasMoreData: moreTodos.hasMoreData,
      };
    });
  }, [data, query]);

  return {
    data,
    loadMore,
  } as const;
}