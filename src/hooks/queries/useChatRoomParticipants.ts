import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getChatRoomParticipants } from "Src/api/chatroomsApi";
import { GET_CHATROOM_PARTICIPANTS_KEY } from "Src/constants/queryKeys";
import { handleRetry } from "Src/lib/utilFunction";
import { TChatRoomParticipantsResponse } from "Src/typings/types";

export function useChatRoomParticipants() {
  const { ChatRoomId } = useParams();
  const qc = useQueryClient();

  const {
    data,
    isLoading,
    error,
  } = useQuery<TChatRoomParticipantsResponse>({
    queryKey: [GET_CHATROOM_PARTICIPANTS_KEY, ChatRoomId],
    queryFn: () => getChatRoomParticipants(ChatRoomId),
    refetchOnWindowFocus: false,
    suspense: true,
    useErrorBoundary: true,
    retry: (failureCount, error) => handleRetry([ 400, 401, 403, 404 ], failureCount, error),
  });

  if (isLoading) throw new Promise(() => {});
  if (error) throw error;
  if (data === null || data === undefined) throw new Error();

  const loadMore = async () => {
    const beforeParticipantId = data.participants[data.participants.length-1].id;
    const moreParticipants = await getChatRoomParticipants(ChatRoomId, beforeParticipantId);

    qc.setQueryData<TChatRoomParticipantsResponse>([GET_CHATROOM_PARTICIPANTS_KEY, ChatRoomId], (prev) => {
      if (!prev) return;

      return {
        participants: [ ...prev.participants, ...moreParticipants.participants ],
        participantCount: prev.participantCount,
        hasMoreData: moreParticipants.hasMoreData,
      };
    });
  };

  return {
    data,
    loadMore,
  } as const;
}