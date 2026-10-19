import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getChatRoomParticipantCount } from "Src/api/chatroomsApi";
import { GET_CHATROOM_PARTICIPANT_COUNT_KEY } from "Src/constants/queryKeys";
import { handleRetry } from "Src/lib/utilFunction";

export function useChatRoomParticipantCount() {
  const { ChatRoomId: _ChatRoomId } = useParams();

  const { data } = useSuspenseQuery<number>({
    queryKey: [GET_CHATROOM_PARTICIPANT_COUNT_KEY],
    queryFn: () => getChatRoomParticipantCount(_ChatRoomId),
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => handleRetry([ 400, 401, 403, 404 ], failureCount, error),
  });

  return { data } as const;
}