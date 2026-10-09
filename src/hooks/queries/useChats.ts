import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { getSharedspaceChats } from "Src/api/chatsApi";
import { GET_SHAREDSPACE_CHATS_KEY } from "Constants/queryKeys";
import { handleRetry } from "Lib/utilFunction";
import { useParams } from "react-router-dom";

export function useChats() {
  const { ChatRoomId: _ChatRoomId } = useParams();

  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isFetchNextPageError,
  } = useSuspenseInfiniteQuery({
    queryKey: [GET_SHAREDSPACE_CHATS_KEY, _ChatRoomId],
    queryFn: ({ pageParam }) => getSharedspaceChats(_ChatRoomId, pageParam),
    initialPageParam: '',
    getNextPageParam: (lastPage) => lastPage.hasMoreData ? lastPage.chats[lastPage.chats.length-1].id : undefined,
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