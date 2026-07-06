import { TJoinRequestsResponse } from "Src/typings/types";
import { axiosInstance } from "./axiosInstance";

export const getJoinRequest = async (
  url: string | undefined,
  beforeJoinRequestId?: string,
): Promise<TJoinRequestsResponse> => {
  if (!url) {
    return { joinRequests: [], hasMoreData: false };
  }

  const { data } = await axiosInstance
    .get(`api/sharedspaces/${url}/joinrequest`, {
      params: {
        before: beforeJoinRequestId,
      },
    });

  return data;
};

export const createJoinRequest = async (
  url: string,
  message: string,
) => {
  await axiosInstance
    .post(`api/sharedspaces/${url}/joinrequest`, {
      message,
    });
};

export const resolveJoinRequest = async (
  url: string | undefined,
  id: string,
  RoleName: string,
) => {
  if (!url) {
    return;
  }

  await axiosInstance
    .post(`api/sharedspaces/${url}/joinrequest/${id}/resolve`, {
      RoleName,
    });
};

export const rejectJoinRequest = async (
  url: string | undefined,
  id: string,
) => {
  if (!url) {
    return;
  }

  await axiosInstance
    .post(`api/sharedspaces/${url}/joinrequest/${id}`);
};