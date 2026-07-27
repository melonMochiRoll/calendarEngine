import { TImageMetaData } from "Src/typings/types";
import { axiosInstance } from "./axiosInstance";

export const getSharedspaceChats = async (
  SharedspaceId: string | undefined,
  beforeChatId?: string,
) => {
  if (!SharedspaceId) {
    return;
  }

  const { data } = await axiosInstance
    .get(`/api/sharedspaces/${SharedspaceId}/chats`, {
      params: {
        before: beforeChatId,
      },
    });

  return data;
};

export const getChatspaceChats = async (
  SharedspaceId: string | undefined,
  beforeChatId?: string,
) => {
  if (!SharedspaceId) {
    return;
  }

  const { data } = await axiosInstance
    .get(`/api/chatspaces/${SharedspaceId}/chats`, {
      params: {
        before: beforeChatId,
      },
    });

  return data;
};

export const generatePresignedPutUrl = async (
  SharedspaceId: string | undefined,
  metaDatas: TImageMetaData[],
): Promise<Array<{ key: string, presignedUrl: string, contentType: string }>> => {
  const { data } = await axiosInstance
    .post(
      `/api/space/${SharedspaceId}/chats/images/presigned-url`,
      {
        metaDatas,
      },
    );

  return data;
};