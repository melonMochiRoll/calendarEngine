import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { getInvites } from "Src/api/inviteApi";
import { GET_INVITES_KEY } from "Src/constants/queryKeys";
import { handleRetry } from "Src/lib/utilFunction";

export function useInvites() {
  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isFetchNextPageError,
  } = useSuspenseInfiniteQuery({
    queryKey: [GET_INVITES_KEY],
    queryFn: () => getInvites(),
    initialPageParam: '',
    getNextPageParam: (lastPage) => lastPage.hasMoreData ? lastPage.invites[lastPage.invites.length-1].id : undefined,
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