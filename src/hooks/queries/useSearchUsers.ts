import { useQuery, useQueryClient } from "@tanstack/react-query";
import { TSearchUsersList } from "Typings/types";
import { searchUsers } from "Api/usersApi";
import { SEARCH_USERS_KEY } from "Constants/queryKeys";
import { handleRetry } from "Lib/utilFunction";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

type UseSearchUsersReturnType = {
  data: TSearchUsersList,
  nextPage: () => void,
};

export function useSearchUsers(query: string): UseSearchUsersReturnType {
  const { url: _url } = useParams();
  const qc = useQueryClient();
  const [ page, setPage ] = useState(1);
  
  const {
    data,
    isLoading,
    error,
  } = useQuery<TSearchUsersList>({
    queryKey: [SEARCH_USERS_KEY, _url, query],
    queryFn: () => searchUsers(_url, query, page),
    refetchOnWindowFocus: false,
    suspense: true,
    useErrorBoundary: true,
    retry: (failureCount, error) => handleRetry([ 401 ], failureCount, error),
  });

  useEffect(() => {
    setPage(1);
  }, [query]);

  useEffect(() => {
    if (page > 1) {
      searchUsers(_url, query, page)
        .then((res: TSearchUsersList) => {
          qc.setQueryData<TSearchUsersList>([SEARCH_USERS_KEY, _url, query], (prev) => {
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
    nextPage: () => setPage(prev => prev + 1)
  };
}