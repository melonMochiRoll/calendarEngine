import { TChatRoomParticipantsResponse, TDmChatRoomResponse } from "Src/typings/types";
import { axiosInstance } from "./axiosInstance";

export const getDmChatRooms = async (page = 1): Promise<TDmChatRoomResponse> => {
  const { data } = await axiosInstance
    .get(`/api/dms/chatrooms`, {
      params: {
        page,
      },
    });

  return data;
};

export const getChatRoomParticipants = async (
  ChatRoomId: string | undefined,
  beforeParticipantId?: string,
): Promise<TChatRoomParticipantsResponse> => {
  if (!ChatRoomId) {
    return {
      participants: [],
      participantCount: 0,
      hasMoreData: false,
    };
  }

  const { data } = await axiosInstance
    .get(`/api/chatrooms/${ChatRoomId}/participants`, {
      params: {
        before: beforeParticipantId,
      },
    });

  return data;
};

export const createSharedspaceChatRoom = async (
  SharedspaceId: String,
  name: string,
) => {
  await axiosInstance
    .post(`/api/sharedspaces/${SharedspaceId}/chatrooms`, {
      name,
    });
};

export const updateSharedspaceChatRoomName = async (
  SharedspaceId: String,
  ChatRoomId: string,
  name: string,
) => {
  await axiosInstance
    .patch(`/api/sharedspaces/${SharedspaceId}/chatrooms/${ChatRoomId}/name`, {
      name,
    });
};

export const deleteSharedspaceChatRoom = async (
  SharedspaceId: String,
  ChatRoomId: string,
) => {
  await axiosInstance
    .delete(`/api/sharedspaces/${SharedspaceId}/chatrooms/${ChatRoomId}`);
};

export const createDmChatRoom = async (targetUserId: string): Promise<{ ChatRoomId: string }> => {
  const { data } = await axiosInstance
    .post(`/api/dms/chatrooms`, {
      targetUserId,
    });
  
  return data;
};