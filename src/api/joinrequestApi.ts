import { axiosInstance } from "./axiosInstance";

export const getJoinRequest = async (
  url: string | undefined,
) => {
  if (!url) {
    return;
  }

  const { data } = await axiosInstance
    .get(`api/sharedspaces/${url}/joinrequest`);

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