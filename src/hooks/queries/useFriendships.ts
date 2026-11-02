import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { getFriendships } from "Src/api/friendshipsApi";
import { GET_FRIENDSHIPS } from "Src/constants/queryKeys";
import { handleRetry } from "Src/lib/utilFunction";

export function useFriendships() {
  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isFetchNextPageError,
  } = useSuspenseInfiniteQuery({
    queryKey: [GET_FRIENDSHIPS],
    queryFn: () => getFriendships(),
    initialPageParam: '',
    getNextPageParam: (lastPage) => lastPage.hasMoreData ? lastPage.friendships[lastPage.friendships.length-1].id : undefined,
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