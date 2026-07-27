import { TJoinRequestsResponse } from "Src/typings/types";
import { axiosInstance } from "./axiosInstance";

export const getJoinRequest = async (
  SharedspaceId: string | undefined,
  beforeJoinRequestId?: string,
): Promise<TJoinRequestsResponse> => {
  if (!SharedspaceId) {
    return { joinRequests: [], hasMoreData: false };
  }

  const { data } = await axiosInstance
    .get(`api/sharedspaces/${SharedspaceId}/joinrequest`, {
      params: {
        before: beforeJoinRequestId,
      },
    });

  return data;
};

export const createJoinRequest = async (
  SharedspaceId: string,
  message: string,
) => {
  await axiosInstance
    .post(`api/sharedspaces/${SharedspaceId}/joinrequest`, {
      message,
    });
};

export const resolveJoinRequest = async (
  SharedspaceId: string | undefined,
  id: string,
  RoleName: string,
) => {
  if (!SharedspaceId) {
    return;
  }

  await axiosInstance
    .post(`api/sharedspaces/${SharedspaceId}/joinrequest/${id}/resolve`, {
      RoleName,
    });
};

export const rejectJoinRequest = async (
  SharedspaceId: string | undefined,
  id: string,
) => {
  if (!SharedspaceId) {
    return;
  }

  await axiosInstance
    .post(`api/sharedspaces/${SharedspaceId}/joinrequest/${id}`);
};