import { useQuery, useQueryClient } from "@tanstack/react-query";
import { TSearchUsersResponse } from "Typings/types";
import { searchUsers } from "Api/usersApi";
import { SEARCH_USERS_KEY } from "Constants/queryKeys";
import { handleRetry } from "Lib/utilFunction";
import { useCallback } from "react";
import { useParams } from "react-router-dom";

export function useSearchUsers(query: string) {
  const { url: _url } = useParams();
  const qc = useQueryClient();
  
  const {
    data,
    isLoading,
    error,
  } = useQuery<TSearchUsersResponse>({
    queryKey: [SEARCH_USERS_KEY, _url, query],
    queryFn: () => searchUsers(_url, query),
    refetchOnWindowFocus: false,
    suspense: true,
    useErrorBoundary: true,
    retry: (failureCount, error) => handleRetry([], failureCount, error),
  });

  if (isLoading) throw new Promise(() => {});
  if (error) throw error;
  if (data === null || data === undefined) throw new Error();

  const loadMore = useCallback(async () => {
    const moreUsers = await searchUsers(_url, query, data.users[data.users.length-1].id);

    qc.setQueryData<TSearchUsersResponse>([SEARCH_USERS_KEY, _url, query], (prev) => {
      if (!prev) return;

      return {
        users: [ ...prev.users, ...moreUsers.users ],
        hasMoreData: moreUsers.hasMoreData,
      };
    });
  }, [data, query]);

  return {
    data,
    loadMore,
  } as const;
}