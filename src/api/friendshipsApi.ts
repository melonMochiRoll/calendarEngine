import { axiosInstance } from "./axiosInstance";

export const getFriendships = async (
  beforeFriendshipId?: string,
) => {
  const { data } = await axiosInstance
    .get(`/api/friendships`, {
      params: {
        before: beforeFriendshipId,
      },
    });

  return data;
};