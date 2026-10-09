import { TChats, TImageMetaData } from "Src/typings/types";
import { axiosInstance } from "./axiosInstance";

export const getSharedspaceChats = async (
  ChatRoomId: string | undefined,
  beforeChatId?: string,
): Promise<TChats> => {
  if (!ChatRoomId) {
    return {
      chats: [],
      hasMoreData: false,
    };
  }

  const { data } = await axiosInstance
    .get(`/api/sharedspaces/chatrooms/${ChatRoomId}/chats`, {
      params: {
        before: beforeChatId,
      },
    });

  return data;
};

export const getDmChats = async (
  ChatRoomId: string | undefined,
  beforeChatId?: string,
) => {
  if (!ChatRoomId) {
    return;
  }

  const { data } = await axiosInstance
    .get(`/api/dm/chatrooms/${ChatRoomId}/chats`, {
      params: {
        before: beforeChatId,
      },
    });

  return data;
};

export const generatePresignedPutUrl = async (
  ChatRoomId: string | undefined,
  metaDatas: TImageMetaData[],
): Promise<Array<{ key: string, presignedUrl: string, contentType: string }>> => {
  const { data } = await axiosInstance
    .post(
      `/api/chatrooms/${ChatRoomId}/presigned-url`,
      {
        metaDatas,
      },
    );

  return data;
};