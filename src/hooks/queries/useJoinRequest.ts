import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { getJoinRequest } from "Api/joinrequestApi";
import { GET_JOINREQUEST_KEY } from "Constants/queryKeys";
import { handleRetry } from "Lib/utilFunction";
import { useParams } from "react-router-dom";

export function useJoinRequest() {
  const { SharedspaceId: _SharedspaceId } = useParams();

  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isFetchNextPageError,
  } = useSuspenseInfiniteQuery({
    queryKey: [GET_JOINREQUEST_KEY, _SharedspaceId],
    queryFn: () => getJoinRequest(_SharedspaceId),
    initialPageParam: '',
    getNextPageParam: (lastPage) => lastPage.hasMoreData ? lastPage.joinRequests[lastPage.joinRequests.length-1].id : undefined,
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => handleRetry([ 400, 401, 403, 404 ], failureCount, error),
  });

  return {
    data,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isFetchNextPageError,
  } as const;
}