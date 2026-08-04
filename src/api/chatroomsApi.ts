import { axiosInstance } from "./axiosInstance";

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
    .delete(`/api/sharedspaces/${SharedspaceId}/chatrooms`, {
      params: {
        ChatRoomId,
      },
    })
};