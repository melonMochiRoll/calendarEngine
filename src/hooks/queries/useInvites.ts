import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { getInvites } from "Src/api/inviteApi";
import { GET_INVITES_KEY } from "Src/constants/queryKeys";
import { handleRetry } from "Src/lib/utilFunction";
import { TInvitePayload } from "Src/typings/types";

export function useInvites() {
  const qc = useQueryClient();

  const { data } = useSuspenseQuery<TInvitePayload>({
    queryKey: [GET_INVITES_KEY],
    queryFn: () => getInvites(),
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => handleRetry([ 400, 401, 403, 404 ], failureCount, error),
  });

  const loadMore = async () => {
    const moreInvites = await getInvites(data.invites[data.invites.length-1].id);

    qc.setQueryData<TInvitePayload>([GET_INVITES_KEY], (prev) => {
      if (!prev) return;

      return {
        invites: [ ...prev.invites, ...moreInvites.invites ],
        hasMoreData: prev.hasMoreData,
      };
    });
  };

  return {
    data,
    loadMore,
  } as const;
}