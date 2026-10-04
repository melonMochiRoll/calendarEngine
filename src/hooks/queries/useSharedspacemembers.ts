import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getSharedspaceMembers } from "Src/api/sharedspacesApi";
import { GET_SHAREDSPACE_MEMBERS_KEY } from "Src/constants/queryKeys";
import { handleRetry } from "Src/lib/utilFunction";
import { TSharedspaceMembersResponse } from "Src/typings/types";

export function useSharedspacemembers() {
  const { SharedspaceId: _SharedspaceId } = useParams();
  const qc = useQueryClient();

  const { data } = useSuspenseQuery<TSharedspaceMembersResponse>({
    queryKey: [GET_SHAREDSPACE_MEMBERS_KEY, _SharedspaceId],
    queryFn: () => getSharedspaceMembers(_SharedspaceId),
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => handleRetry([ 400, 401, 403, 404 ], failureCount, error),
  });

  const loadMore = async () => {
    const moreMembers = await getSharedspaceMembers(_SharedspaceId, data.members[data.members.length-1].id);

    qc.setQueryData<TSharedspaceMembersResponse>([GET_SHAREDSPACE_MEMBERS_KEY, _SharedspaceId], (prev) => {
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