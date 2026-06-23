import { TImageMetaData } from "Src/typings/types";
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

export const generatePresignedPutUrl = async (
  url: string | undefined,
  metaDatas: TImageMetaData[],
): Promise<Array<{ id: string, presignedUrl: string, contentType: string }>> => {
  const { data } = await axiosInstance
    .post(
      `/api/space/${url}/chats/images/presigned-url`,
      {
        metaDatas,
      },
    );

  return data;
};