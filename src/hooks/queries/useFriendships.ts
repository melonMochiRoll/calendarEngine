import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { getFriendships } from "Src/api/friendshipsApi";
import { GET_FRIENDSHIPS } from "Src/constants/queryKeys";
import { handleRetry } from "Src/lib/utilFunction";
import { TFriendshipResponse } from "Src/typings/types";

export function useFriendships() {
  const qc = useQueryClient();
  
  const {
    data,
    isLoading,
    error,
  } = useQuery<TFriendshipResponse>({
    queryKey: [GET_FRIENDSHIPS],
    queryFn: () => getFriendships(),
    refetchOnWindowFocus: false,
    suspense: true,
    useErrorBoundary: true,
    retry: (failureCount, error) => handleRetry([ 400, 401, 403, 404 ], failureCount, error),
  });

  if (isLoading) throw new Promise(() => {});
  if (error) throw error;
  if (data === null || data === undefined) throw new Error();

  const loadMore = useCallback(async () => {
    const moreFriendship = await getFriendships(data.friendships[data.friendships.length-1].id);

    qc.setQueryData<TFriendshipResponse>([GET_FRIENDSHIPS], (prev) => {
      if (!prev) return;

      return {
        friendships: [ ...prev.friendships || [], ...moreFriendship.friendships ],
        hasMoreData: moreFriendship.hasMoreData,
      };
    });
  }, [data]);

  return {
    data,
    loadMore,
  } as const;
}