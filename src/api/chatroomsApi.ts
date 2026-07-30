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