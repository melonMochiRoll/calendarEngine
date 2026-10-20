import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getDmChats } from "Src/api/chatsApi";
import { GET_DM_CHATS_KEY } from "Src/constants/queryKeys";
import { handleRetry } from "Src/lib/utilFunction";

export function useDmChats() {
  const { ChatRoomId: _ChatRoomId } = useParams();

  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isFetchNextPageError,
  } = useSuspenseInfiniteQuery({
    queryKey: [GET_DM_CHATS_KEY, _ChatRoomId],
    queryFn: ({ pageParam }) => getDmChats(_ChatRoomId, pageParam),
    initialPageParam: '',
    getNextPageParam: (lastPage) => lastPage.hasMoreData ? lastPage.chats[lastPage.chats.length-1].id : undefined,
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => handleRetry([ 400, 403, 404 ], failureCount, error),
  });

  return {
    data,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isFetchNextPageError,
  } as const;
}