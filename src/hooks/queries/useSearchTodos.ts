import { useQuery, useQueryClient } from "@tanstack/react-query";
import { SEARCH_TODOS_KEY } from "Constants/queryKeys";
import { searchTodos } from "Api/todosApi";
import { useEffect, useState } from "react";
import { TSearchTodosPayload } from "Typings/types";
import { useParams } from "react-router-dom";
import { handleRetry } from "Lib/utilFunction";

type UseSearchTodosReturnType = {
  data: TSearchTodosPayload;
  nextPage: () => void;
};

export function useSearchTodos(query: string): UseSearchTodosReturnType {
  const qc = useQueryClient();
  const { url: _url } = useParams();
  const [ page, setPage ] = useState(1);

  const {
    data,
    isLoading,
    error,
  } = useQuery<TSearchTodosPayload>({
    queryKey: [SEARCH_TODOS_KEY, _url, query],
    queryFn: () => searchTodos(_url, query, page),
    refetchOnWindowFocus: false,
    suspense: true,
    useErrorBoundary: true,
    retry: (failureCount, error) => handleRetry([ 400, 401, 403, 404 ], failureCount, error),
  });

  useEffect(() => {
    setPage(1);
  }, [query]);

  useEffect(() => {
    if (page > 1) {
      searchTodos(_url, query, page)
        .then((res: TSearchTodosPayload) => {
          qc.setQueryData<TSearchTodosPayload>([SEARCH_TODOS_KEY, _url, query], (prev) => {
            return {
              items: [ ...prev?.items || [], ...res.items ],
              hasMoreData: res.hasMoreData,
            };
          });
        });
    }
  }, [page]);

  if (isLoading) throw new Promise(() => {});
  if (error) throw error;
  if (data === null || data === undefined) throw new Error();

  return {
    data,
    nextPage: () => setPage((prev) => prev + 1),
  };
}