import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getSharedspaceMembers } from "Src/api/sharedspacesApi";
import { GET_SHAREDSPACE_MEMBERS_KEY } from "Src/constants/queryKeys";
import { handleRetry } from "Src/lib/utilFunction";
import { TSharedspaceMembersResponse } from "Src/typings/types";

export function useSharedspacemembers() {
  const { url: _url } = useParams();
  const qc = useQueryClient();

  const {
    data,
    isLoading,
    error,
  } = useQuery<TSharedspaceMembersResponse>({
    queryKey: [GET_SHAREDSPACE_MEMBERS_KEY, _url],
    queryFn: () => getSharedspaceMembers(_url),
    refetchOnWindowFocus: false,
    suspense: true,
    useErrorBoundary: true,
    retry: (failureCount, error) => handleRetry([ 400, 403, 404 ], failureCount, error),
  });

  if (isLoading) throw new Promise(() => {});
  if (error) throw error;
  if (data === null || data === undefined) throw new Error();

  const loadMore = async () => {
    const moreMembers = await getSharedspaceMembers(_url, data.members[data.members.length-1].id);

    qc.setQueryData<TSharedspaceMembersResponse>([GET_SHAREDSPACE_MEMBERS_KEY, _url], (prev) => {
      if (!prev) return;

      return {
        members: [ ...prev.members, ...moreMembers.members ],
        hasMoreData: moreMembers.hasMoreData,
      };
    });
  };
  
  return {
    data,
    loadMore,
  } as const;
}