import { axiosInstance } from "./axiosInstance";

export const getChatspaceChats = async (
  url: string | undefined,
  beforeChatId?: string,
) => {
  if (!url) {
    return;
  }

  const { data } = await axiosInstance
    .get(`/api/chatspaces/${url}/chats`, {
      params: {
        before: beforeChatId,
      },
    });

  return data;
};