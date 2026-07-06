import { TSharedspaceMembersResponse, TSharedspaceMembersRoles, TSubscribedspacesResponse } from "Typings/types";
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
): Promise<TSubscribedspacesResponse> => {
  const { data } = await axiosInstance
    .get(`/api/sharedspaces/subscribed`, {
      params: {
        sort,
        page,
      },
    });

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
  beforeUserId?: string,
): Promise<TSharedspaceMembersResponse> => {
  if (!url) {
    return { members: [], hasMoreData: false };
  }
  
  const { data } = await axiosInstance.get(
    `/api/sharedspaces/${url}/members`, {
      params: {
        before: beforeUserId,
      },
    }
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