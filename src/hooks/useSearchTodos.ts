import { useQuery, useQueryClient } from "@tanstack/react-query";
import { SEARCH_TODOS_KEY } from "Constants/queryKeys";
import { searchTodos } from "Api/todosApi";
import { useEffect, useState } from "react";
import { TSearchTodos } from "Typings/types";
import { useParams } from "react-router-dom";
import { useAppSelector } from "./reduxHooks";

type TypeSafeReturnType = {
  data: TSearchTodos[];
  canLoadMore: boolean;
  nextOffset: () => void;
};

type FetchStateReturnType = {
  data: TSearchTodos[] | undefined;
  isLoading: boolean;
  error: unknown;
  canLoadMore: boolean;
  nextOffset: () => void;
};

function useSearchTodos(options: { suspense: true, throwOnError: true }): TypeSafeReturnType;
function useSearchTodos(options?: { suspense: boolean, throwOnError: boolean }): FetchStateReturnType;

function useSearchTodos(options = { suspense: false, throwOnError: false }) {
  const qc = useQueryClient();
  const { url: _url } = useParams();
  const { query } = useAppSelector(state => state.searchTodos);
  const { suspense, throwOnError } = options;

  const [ offset, setOffset ] = useState(1);
  const [ canLoadMore, setCanLoadMore ] = useState(true);

  const {
    data,
    refetch,
    isLoading,
    error,
  } = useQuery<TSearchTodos[]>({
    queryKey: [SEARCH_TODOS_KEY],
    queryFn: () => searchTodos(_url, query),
    refetchOnWindowFocus: false,
    suspense,
    useErrorBoundary: throwOnError,
  });

  useEffect(() => {
    if (!isLoading && data && data?.length < 10) {
      setCanLoadMore(false);
    }
  }, [data]);

  useEffect(() => {
    if (query) {
      const delay = setTimeout(() => {
        setOffset(1);
        setCanLoadMore(true);
        refetch();
      }, 500);
  
      return () => {
        clearTimeout(delay);
      };
    }
  }, [query]);

  useEffect(() => {
    if (offset > 1) {
      searchTodos(_url, query, offset)
        .then(res => {
          if (res?.length < 10) {
            setCanLoadMore(false);
          }
          qc.setQueryData([SEARCH_TODOS_KEY], [ ...data || [], ...res ]);
        });
    }
  }, [offset]);

  if (suspense) {
    if (isLoading) throw new Promise(() => {});
    if (error) throw error;
    if (!data) throw new Error();

    return {
      data,
      canLoadMore,
      nextOffset: () => setOffset(prev => prev + 1),
    };
  }

  return {
    data,
    isLoading,
    error,
    canLoadMore,
    nextOffset: () => setOffset(prev => prev + 1),
  };
}

export default useSearchTodos;