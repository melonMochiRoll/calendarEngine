import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getSharedspaceMembers } from "Src/api/sharedspacesApi";
import { GET_SHAREDSPACE_MEMBERS_KEY } from "Src/constants/queryKeys";
import { handleRetry } from "Src/lib/utilFunction";
import { TSharedspaceMembersList } from "Src/typings/types";

export function useSharedspacemembers() {
  const { url: _url } = useParams();
  const qc = useQueryClient();

  const {
    data,
    isLoading,
    error,
  } = useQuery<TSharedspaceMembersList>({
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
    const moreUsers = await getSharedspaceMembers(_url, data.items[data.items.length-1].id);

    qc.setQueryData<TSharedspaceMembersList>([GET_SHAREDSPACE_MEMBERS_KEY, _url], (prev) => {
      if (!prev) return;

      return {
        items: [ ...prev.items, ...moreUsers.items ],
        hasMoreData: moreUsers.hasMoreData,
      };
    });
  };
  
  return {
    data,
    loadMore,
  } as const;
}