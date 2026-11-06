import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { searchUsers } from "Src/api/friendshipsApi";
import { SEARCH_USERS_FOR_FRIENDSHIP_KEY } from "Src/constants/queryKeys";
import { handleRetry } from "Src/lib/utilFunction";

export function useSearchUsersForFriendship(query: string) {
  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isFetchNextPageError,
  } = useSuspenseInfiniteQuery({
    queryKey: [SEARCH_USERS_FOR_FRIENDSHIP_KEY, query],
    queryFn: () => searchUsers(query),
    initialPageParam: '',
    getNextPageParam: (lastPage) => lastPage.hasMoreData ? lastPage.users[lastPage.users.length-1].id : undefined,
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
};