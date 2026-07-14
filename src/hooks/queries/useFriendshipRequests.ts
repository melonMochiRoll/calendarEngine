import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getFriendshipRequests } from "Src/api/friendshipsApi";
import { GET_FRIENDSHIP_REQUESTS_KEY } from "Src/constants/queryKeys";
import { handleRetry } from "Src/lib/utilFunction";
import { TFriendshipRequestsResponse } from "Src/typings/types";

export function useFriendshipRequests() {
  const qc = useQueryClient();

  const {
    data,
    isLoading,
    error,
  } = useQuery<TFriendshipRequestsResponse>({
    queryKey: [GET_FRIENDSHIP_REQUESTS_KEY],
    queryFn: () => getFriendshipRequests(),
    refetchOnWindowFocus: false,
    suspense: true,
    useErrorBoundary: true,
    retry: (failureCount, error) => handleRetry([ 400, 401, 403, 404 ], failureCount, error),
  });

  if (isLoading) throw new Promise(() => {});
  if (error) throw error;
  if (data === null || data === undefined) throw new Error();

  const loadMore = async () => {
    const moreFriendshipRequests = await getFriendshipRequests(data.friendshipRequests[data.friendshipRequests.length-1].id);

    qc.setQueryData<TFriendshipRequestsResponse>([GET_FRIENDSHIP_REQUESTS_KEY], (prev) => {
      if (!prev) return;

      return {
        friendshipRequests: [ ...prev.friendshipRequests || [], ...moreFriendshipRequests.friendshipRequests ],
        hasMoreData: moreFriendshipRequests.hasMoreData,
      };
    });
  };

  return {
    data,
    loadMore,
  } as const;
}