import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getChatspaceMembers } from "Src/api/chatspacesApi";
import { GET_CHATSPACE_MEMBERS_KEY } from "Src/constants/queryKeys";
import { handleRetry } from "Src/lib/utilFunction";
import { TChatspaceMembersResponse } from "Src/typings/types";

export function useChatspacemembers() {
  const { url: _url } = useParams();
  const qc = useQueryClient();

  const {
    data,
    isLoading,
    error,
  } = useQuery<TChatspaceMembersResponse>({
    queryKey: [GET_CHATSPACE_MEMBERS_KEY, _url],
    queryFn: () => getChatspaceMembers(_url),
    refetchOnWindowFocus: false,
    suspense: true,
    useErrorBoundary: true,
    retry: (failureCount, error) => handleRetry([ 400, 403, 404 ], failureCount, error),
  });

  if (isLoading) throw new Promise(() => {});
  if (error) throw error;
  if (data === null || data === undefined) throw new Error();

  const loadMore = async () => {
    const moreMembers = await getChatspaceMembers(_url, data.members[data.members.length-1].id);

    qc.setQueryData<TChatspaceMembersResponse>([GET_CHATSPACE_MEMBERS_KEY, _url], (prev) => {
      if (!prev) return;

      return {
        members: [ ...prev.members, ...moreMembers.members ],
        hasMoreData: moreMembers.hasMoreData,
        memberCount: prev.memberCount,
      };
    });
  };
  
  return {
    data,
    loadMore,
  } as const;
}