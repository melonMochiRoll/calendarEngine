import { useQuery, useQueryClient } from "@tanstack/react-query";
import { SEARCH_TODOS_KEY } from "Lib/queryKeys";
import { searchTodos } from "Api/todosApi";
import { useEffect, useState } from "react";
import { TSearchTodos } from "Typings/types";
import { useParams } from "react-router-dom";
import { useAppSelector } from "./reduxHooks";

type TUseSearchReturnData = {
  data: TSearchTodos[],
  isLoading: boolean,
  canLoadMore: boolean,
  nextOffset: () => void,
};

const useSearchTodos = (): TUseSearchReturnData => {
  const qc = useQueryClient();
  const { url = '' } = useParams();
  const { query } = useAppSelector(state => state.searchTodos);

  const [ offset, setOffset ] = useState(1);
  const [ canLoadMore, setCanLoadMore ] = useState(true);

  const {
    data,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: [SEARCH_TODOS_KEY],
    queryFn: () => searchTodos(url, query),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!isLoading && data?.length < 10) {
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
      searchTodos(url, query, offset)
        .then(res => {
          if (res?.length < 10) {
            setCanLoadMore(false);
          }
          qc.setQueryData([SEARCH_TODOS_KEY], [ ...data, ...res ]);
        });
    }
  }, [offset]);

  return {
    data,
    isLoading,
    canLoadMore,
    nextOffset: () => setOffset(prev => prev + 1),
  };
};

export default useSearchTodos;