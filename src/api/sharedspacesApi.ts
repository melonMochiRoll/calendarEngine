import { TSharedspaceMembersResponse, TSharedspaceMembersRoles, TSubscribedspacesResponse } from "Typings/types";
import { axiosInstance } from "./axiosInstance";
import axios from "axios";

export const getSharedspace = async (SharedspaceId: string | undefined) => {
  if (!SharedspaceId) {
    return;
  }

  const { data } = await axiosInstance
    .get(`/api/sharedspaces/${SharedspaceId}/view`);

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
  SharedspaceId: string,
) => {
  await axiosInstance
    .patch(`api/sharedspaces/${SharedspaceId}/name`, {
      name,
    });
};

export const updateSharedspaceOwner = async (
  SharedspaceId: string,
  UserId: string,
) => {
  await axiosInstance
    .patch(`api/sharedspaces/${SharedspaceId}/owner`, {
      newOwnerId: UserId,
    });
};

export const deleteSharedspace = async (SharedspaceId: string) => {
  await axiosInstance
    .delete(`/api/sharedspaces/${SharedspaceId}`);
};

export const getSharedspaceMembers = async (
  SharedspaceId: string | undefined,
  beforeUserId?: string,
): Promise<TSharedspaceMembersResponse> => {
  if (!SharedspaceId) {
    return { members: [], hasMoreData: false };
  }
  
  const { data } = await axiosInstance.get(
    `/api/sharedspaces/${SharedspaceId}/members`, {
      params: {
        before: beforeUserId,
      },
    }
  );

  return data;
};

export const updateSharedspaceMember = async (
  SharedspaceId: string,
  UserId: string,
  RoleName: TSharedspaceMembersRoles,
) => {
  await axiosInstance
    .patch(`/api/sharedspaces/${SharedspaceId}/members`, {
      UserId,
      RoleName,
    });
};

export const updateSharedspacePrivate = async (
  SharedspaceId: string | undefined,
  Private: boolean,
) => {
  await axiosInstance
    .patch(`/api/sharedspaces/${SharedspaceId}/private`, {
      private: Private,
    });
};

export const kickSharedspace = async (
  SharedspaceId: string,
  UserId: string,
) => {
  await axiosInstance
    .delete(`/api/sharedspaces/${SharedspaceId}/members/${UserId}`);
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