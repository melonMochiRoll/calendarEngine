import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getChatspaceMembers } from "Src/api/chatspacesApi";
import { GET_CHATSPACE_MEMBERS_KEY } from "Src/constants/queryKeys";
import { handleRetry } from "Src/lib/utilFunction";
import { TChatspaceMembersList } from "Src/typings/types";

export function useChatspacemembers() {
  const { url: _url } = useParams();
  const qc = useQueryClient();
  const [ page, setPage ] = useState(1);

  const {
    data,
    isLoading,
    error,
  } = useQuery<TChatspaceMembersList>({
    queryKey: [GET_CHATSPACE_MEMBERS_KEY, _url],
    queryFn: () => getChatspaceMembers(_url, page),
    refetchOnWindowFocus: false,
    suspense: true,
    useErrorBoundary: true,
    retry: (failureCount, error) => handleRetry([ 400, 403, 404 ], failureCount, error),
  });

  useEffect(() => {
    if (page > 1) {
      getChatspaceMembers(_url, page)
        .then((res: TChatspaceMembersList) => {
          qc.setQueryData<TChatspaceMembersList>([GET_CHATSPACE_MEMBERS_KEY, _url], (prev) => {
            if (!prev) return;

            return {
              members: [ ...prev.members, ...res.members ],
              memberCount: res.memberCount,
              hasMoreData: res.hasMoreData,
            };
          });
        });
    }
  }, [page]);

  if (isLoading) throw new Promise(() => {});
  if (error) throw error;
  if (data === null || data === undefined) throw new Error();
  
  return {
    data,
    nextPage: () => setPage(prev => prev + 1),
  } as const;
}