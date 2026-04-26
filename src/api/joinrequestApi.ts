import { axiosInstance } from "./axiosInstance";

export const getJoinRequest = async (
  url: string | undefined,
) => {
  if (!url) {
    return;
  }

  try {
    const { data } = await axiosInstance
      .get(`api/sharedspaces/${url}/joinrequest`);

    return data;
  } catch (err) {
    throw err;
  }
};

export const createJoinRequest = async (
  url: string,
  message: string,
) => {
  try {
    await axiosInstance
      .post(`api/sharedspaces/${url}/joinrequest`, {
        message,
      });
  } catch (err) {
    throw err;
  }
};

export const resolveJoinRequest = async (
  url: string | undefined,
  id: number,
  RoleName: string,
) => {
  if (!url) {
    throw new Error;
  }

  try {
    await axiosInstance
      .post(`api/sharedspaces/${url}/joinrequest/${id}/resolve`, {
        RoleName,
      });
  } catch (err) {
    throw err;
  }
};

export const rejectJoinRequest = async (
  url: string | undefined,
  id: number,
) => {
  if (!url) {
    throw new Error;
  }

  try {
    await axiosInstance
      .post(`api/sharedspaces/${url}/joinrequest/${id}`);
  } catch (err) {
    throw err;
  }
};