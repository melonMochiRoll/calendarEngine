import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { searchUsers } from "Src/api/friendshipsApi";
import { SEARCH_USERS_FOR_FRIENDSHIP_KEY } from "Src/constants/queryKeys";
import { handleRetry } from "Src/lib/utilFunction";
import { TSearchUsersForFriendshipResponse } from "Src/typings/types";

export function useSearchUsersForFriendship(query: string) {
  const qc = useQueryClient();

  const {
    data,
    isLoading,
    error,
  } = useQuery<TSearchUsersForFriendshipResponse>({
    queryKey: [SEARCH_USERS_FOR_FRIENDSHIP_KEY, query],
    queryFn: () => searchUsers(query),
    refetchOnWindowFocus: false,
    suspense: true,
    useErrorBoundary: true,
    retry: (failureCount, error) => handleRetry([ 400, 401, 403, 404 ], failureCount, error),
  });

  if (isLoading) throw new Promise(() => {});
  if (error) throw error;
  if (data === null || data === undefined) throw new Error();

  const loadMore = useCallback(async () => {
    const moreUsers = await searchUsers(query, data.users[data.users.length-1].id);

    qc.setQueryData<TSearchUsersForFriendshipResponse>([SEARCH_USERS_FOR_FRIENDSHIP_KEY, query], (prev) => {
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
};