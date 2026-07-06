import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getJoinRequest } from "Api/joinrequestApi";
import { GET_JOINREQUEST_KEY } from "Constants/queryKeys";
import { handleRetry } from "Lib/utilFunction";
import { useParams } from "react-router-dom";
import { TJoinRequestsResponse } from "Typings/types";

export function useJoinRequest() {
  const { url: _url } = useParams();
  const qc = useQueryClient();

  const {
    data,
    isLoading,
    error,
  } = useQuery<TJoinRequestsResponse>({
    queryKey: [GET_JOINREQUEST_KEY, _url],
    queryFn: () => getJoinRequest(_url),
    refetchOnWindowFocus: false,
    suspense: true,
    useErrorBoundary: true,
    retry: (failureCount, error) => handleRetry([ 400, 403, 404 ], failureCount, error),
  });

  if (isLoading) throw new Promise(() => {});
  if (error) throw error;
  if (data === null || data === undefined) throw new Error();

  const loadMore = async () => {
    const moreJoinRequests = await getJoinRequest(_url, data.joinRequests[data.joinRequests.length-1].id);

    qc.setQueryData<TJoinRequestsResponse>([GET_JOINREQUEST_KEY, _url], (prev) => {
      if (!prev) return;

      return {
        joinRequests: [ ...prev.joinRequests, ...moreJoinRequests.joinRequests ],
        hasMoreData: moreJoinRequests.hasMoreData,
      };
    });
  };

  return {
    data,
    loadMore,
  } as const;
}