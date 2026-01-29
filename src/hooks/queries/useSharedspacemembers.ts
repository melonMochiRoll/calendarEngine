import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSharedspaceMembers } from "Src/api/sharedspacesApi";
import { GET_SHAREDSPACE_MEMBERS_KEY } from "Src/constants/queryKeys";
import { handleRetry } from "Src/lib/utilFunction";
import { TSharedspaceMembersList } from "Src/typings/types";

type UseSharedspacemembersReturnType = {
  data: TSharedspaceMembersList,
  nextPage: () => void,
};

export function useSharedspacemembers(): UseSharedspacemembersReturnType {
  const { url: _url } = useParams();
  const qc = useQueryClient();
  const [ page, setPage ] = useState(1);

  const {
    data,
    isLoading,
    error,
  } = useQuery<TSharedspaceMembersList>({
    queryKey: [GET_SHAREDSPACE_MEMBERS_KEY, _url],
    queryFn: () => getSharedspaceMembers(_url, page),
    refetchOnWindowFocus: false,
    suspense: true,
    useErrorBoundary: true,
    retry: (failureCount, error) => handleRetry([ 400, 401, 403, 404 ], failureCount, error),
  });

  useEffect(() => {
    if (page > 1) {
      getSharedspaceMembers(_url, page)
        .then((res: TSharedspaceMembersList) => {
          qc.setQueryData<TSharedspaceMembersList>([GET_SHAREDSPACE_MEMBERS_KEY, _url], (prev) => {
            return {
              items: [ ...prev?.items || [], ...res.items ],
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
  };
}