import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getInvites } from "Src/api/inviteApi";
import { GET_INVITES_KEY } from "Src/constants/queryKeys";
import { handleRetry } from "Src/lib/utilFunction";
import { TInvitePayload } from "Src/typings/types";

export function useInvites() {
  const qc = useQueryClient();

  const {
    data,
    isLoading,
    error,
  } = useQuery<TInvitePayload>({
    queryKey: [GET_INVITES_KEY],
    queryFn: () => getInvites(),
    refetchOnWindowFocus: false,
    suspense: true,
    useErrorBoundary: true,
    retry: (failureCount, error) => handleRetry([ 400, 403, 404 ], failureCount, error),
  });

  if (isLoading) throw new Promise(() => {});
  if (error) throw error;
  if (data === null || data === undefined) throw new Error();

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