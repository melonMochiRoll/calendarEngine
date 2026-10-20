import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { getDmChatRooms } from "Src/api/chatroomsApi";
import { GET_DM_CHATROOMS_KEY } from "Src/constants/queryKeys";
import { handleRetry } from "Src/lib/utilFunction";

export function useDmChatRooms() {
  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isFetchNextPageError,
  } = useSuspenseInfiniteQuery({
    queryKey: [GET_DM_CHATROOMS_KEY],
    queryFn: ({ pageParam }) => getDmChatRooms(pageParam),
    initialPageParam: '',
    getNextPageParam: (lastPage) => lastPage.hasMoreData ? lastPage.chatRooms[lastPage.chatRooms.length-1].lastMessageAt : undefined,
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