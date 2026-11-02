import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { getFriendshipRequests } from "Src/api/friendshipsApi";
import { GET_FRIENDSHIP_REQUESTS_KEY } from "Src/constants/queryKeys";
import { handleRetry } from "Src/lib/utilFunction";

export function useFriendshipRequests() {
  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isFetchNextPageError,
  } = useSuspenseInfiniteQuery({
    queryKey: [GET_FRIENDSHIP_REQUESTS_KEY],
    queryFn: () => getFriendshipRequests(),
    initialPageParam: '',
    getNextPageParam: (lastPage) => lastPage.hasMoreData ? lastPage.friendshipRequests[lastPage.friendshipRequests.length-1].id : undefined,
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