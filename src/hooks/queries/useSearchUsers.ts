import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { searchUsers } from "Api/usersApi";
import { SEARCH_USERS_KEY } from "Constants/queryKeys";
import { handleRetry } from "Lib/utilFunction";
import { useParams } from "react-router-dom";

export function useSearchUsers(query: string) {
  const { SharedspaceId: _SharedspaceId } = useParams();
  
  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isFetchNextPageError,
  } = useSuspenseInfiniteQuery({
    queryKey: [SEARCH_USERS_KEY, _SharedspaceId, query],
    queryFn: () => searchUsers(_SharedspaceId, query),
    initialPageParam: '',
    getNextPageParam: (lastPage) => lastPage.hasMoreData ? lastPage.users[lastPage.users.length-1].id : undefined,
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