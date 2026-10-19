import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getChatRoomParticipants } from "Src/api/chatroomsApi";
import { GET_CHATROOM_PARTICIPANTS_KEY } from "Src/constants/queryKeys";
import { handleRetry } from "Src/lib/utilFunction";

export function useChatRoomParticipants() {
  const { ChatRoomId: _ChatRoomId } = useParams();

  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isFetchNextPageError,
  } = useSuspenseInfiniteQuery({
    queryKey: [GET_CHATROOM_PARTICIPANTS_KEY, _ChatRoomId],
    queryFn: ({ pageParam }) => getChatRoomParticipants(_ChatRoomId, pageParam),
    initialPageParam: '',
    getNextPageParam: (lastPage) => lastPage.hasMoreData ? lastPage.participants[lastPage.participants.length-1].id : undefined,
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