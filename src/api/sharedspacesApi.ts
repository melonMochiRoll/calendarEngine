import { TChatPayload, TImageMetaData, TSharedspaceMembersRoles } from "Typings/types";
import { axiosInstance } from "./axiosInstance";
import axios from "axios";

export const getSharedspace = async (url: string | undefined) => {
  if (!url) {
    return;
  }

  const { data } = await axiosInstance
    .get(`/api/sharedspaces/${url}/view`);

  return data;
};

export const getSubscribedspaces = async (
  sort: string,
  page = 1,
) => {
  const { data } = await axiosInstance
    .get(`/api/sharedspaces/subscribed?sort=${sort}&page=${page}`);

  return data;
};

export const createSharedspace = async (): Promise<string> => {
  const { data } = await axiosInstance
    .post(`api/sharedspaces`);

  return data;
};

export const updateSharedspaceName = async (
  name: string,
  url: string,
) => {
  await axiosInstance
    .patch(`api/sharedspaces/${url}/name`, {
      name,
    });
};

export const updateSharedspaceOwner = async (
  url: string,
  UserId: string,
) => {
  await axiosInstance
    .patch(`api/sharedspaces/${url}/owner`, {
      newOwnerId: UserId,
    });
};

export const deleteSharedspace = async (url: string) => {
  await axiosInstance
    .delete(`/api/sharedspaces/${url}`);
};

export const getSharedspaceMembers = async (
  url: string | undefined,
  page: number,
) => {
  if (!url) {
    return;
  }
  
  const { data } = await axiosInstance.get(
    `/api/sharedspaces/${url}/members?page=${page}`
  );

  return data;
};

export const updateSharedspaceMembers = async (
  url: string,
  UserId: string,
  RoleName: TSharedspaceMembersRoles,
) => {
  await axiosInstance
    .patch(`/api/sharedspaces/${url}/members`, {
      UserId,
      RoleName,
    });
};

export const updateSharedspacePrivate = async (
  url: string | undefined,
  Private: boolean,
) => {
  await axiosInstance
    .patch(`/api/sharedspaces/${url}/private`, {
      private: Private,
    });
};

export const deleteSharedspaceMembers = async (
  url: string,
  UserId: string,
) => {
  await axiosInstance
    .delete(`/api/sharedspaces/${url}/members/${UserId}`);
};

export const getSharedspaceChats = async (
  url: string | undefined,
  beforeChatId?: string,
) => {
  if (!url) {
    return;
  }

  const { data } = await axiosInstance
    .get(`/api/sharedspaces/${url}/chats`, {
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
      `/api/sharedspaces/${url}/chats/images/presigned-url`,
      {
        metaDatas,
      },
    );

  return data;
};

export const uploadImageToPresignedUrl = async (
  url: string,
  file: File,
  contentType: string,
) => {
  await axios
    .put(
      url,
      file,
      {
        headers: {
          'Cache-Control': 'public, max-age=31536000, immutable',
          'Content-Type': contentType,
        },
      }
    );
};