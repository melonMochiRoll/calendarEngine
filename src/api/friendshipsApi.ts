import { TFriendshipRequestsResponse, TFriendshipResponse } from "Src/typings/types";
import { axiosInstance } from "./axiosInstance";

export const getFriendships = async (
  beforeFriendshipId?: string,
): Promise<TFriendshipResponse> => {
  const { data } = await axiosInstance
    .get(`/api/friendships`, {
      params: {
        before: beforeFriendshipId,
      },
    });

  return data;
};

export const getFriendshipRequests = async (
  beforeFriendshipRequestId?: string,
): Promise<TFriendshipRequestsResponse> => {
  const { data } = await axiosInstance
    .get(`/api/friendships/requests`, {
      params: {
        before: beforeFriendshipRequestId,
      },
    });

  return data;
};

export const sendFriendship = async (RequesteeId: string) => {
  await axiosInstance
    .post(`/api/friendships`, {
      RequesteeId,
    });
};

export const acceptFriendship = async (RequesterId: string) => {
  await axiosInstance
    .post(`/api/friendships/accept`, {
      RequesterId,
    });
};

export const rejectFriendship = async (RequesterId: string) => {
  await axiosInstance
    .post(`/api/friendships/reject`, {
      RequesterId,
    });
};