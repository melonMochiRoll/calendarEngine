import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { getFriendships } from "Src/api/friendshipsApi";
import { GET_FRIENDSHIPS } from "Src/constants/queryKeys";
import { handleRetry } from "Src/lib/utilFunction";
import { TFriendshipResponse } from "Src/typings/types";

export function useFriendships() {
  const qc = useQueryClient();
  
  const { data } = useSuspenseQuery<TFriendshipResponse>({
    queryKey: [GET_FRIENDSHIPS],
    queryFn: () => getFriendships(),
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => handleRetry([ 400, 401, 403, 404 ], failureCount, error),
  });

  const loadMore = async () => {
    const moreFriendship = await getFriendships(data.friendships[data.friendships.length-1].id);

    qc.setQueryData<TFriendshipResponse>([GET_FRIENDSHIPS], (prev) => {
      if (!prev) return;

      return {
        friendships: [ ...prev.friendships || [], ...moreFriendship.friendships ],
        hasMoreData: moreFriendship.hasMoreData,
      };
    });
  };

  return {
    data,
    loadMore,
  } as const;
}