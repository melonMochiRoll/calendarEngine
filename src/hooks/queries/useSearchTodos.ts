import { useQuery, useQueryClient } from "@tanstack/react-query";
import { SEARCH_TODOS_KEY } from "Constants/queryKeys";
import { searchTodos } from "Api/todosApi";
import { useEffect, useState } from "react";
import { TSearchTodos } from "Typings/types";
import { useParams } from "react-router-dom";
import { handleRetry } from "Lib/utilFunction";

type UseSearchTodosReturnType = {
  data: TSearchTodos[];
  canLoadMore: boolean;
  nextPage: () => void;
};

export function useSearchTodos(query: string): UseSearchTodosReturnType {
  const qc = useQueryClient();
  const { url: _url } = useParams();
  const [ page, setPage ] = useState(1);
  const [ canLoadMore, setCanLoadMore ] = useState(true);

  const {
    data,
    isLoading,
    error,
  } = useQuery<TSearchTodos[]>({
    queryKey: [SEARCH_TODOS_KEY, query],
    queryFn: () => searchTodos(_url, query, page),
    refetchOnWindowFocus: false,
    suspense: true,
    useErrorBoundary: true,
    retry: (failureCount, error) => handleRetry([ 400, 401, 403, 404 ], failureCount, error),
  });

  useEffect(() => {
    setPage(1);
    setCanLoadMore(true);
  }, [query]);

  useEffect(() => {
    if (!isLoading && data && data?.length < 10) {
      setCanLoadMore(false);
    }
  }, [data]);

  useEffect(() => {
    if (page > 1) {
      searchTodos(_url, query, page)
        .then(res => {
          if (res?.length < 10) {
            setCanLoadMore(false);
          }
          qc.setQueryData([SEARCH_TODOS_KEY, query], [ ...data || [], ...res ]);
        });
    }
  }, [page]);

  if (isLoading) throw new Promise(() => {});
  if (error) throw error;
  if (data === null || data === undefined) throw new Error();

  return {
    data,
    canLoadMore,
    nextPage: () => setPage((prev) => prev + 1),
  };
}