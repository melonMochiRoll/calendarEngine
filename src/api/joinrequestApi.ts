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
  } catch (error) {
    throw error;
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
  } catch (error) {
    throw error;
  }
};

export const resolveJoinRequest = async (
  url: string,
  id: number,
  RoleName: string,
) => {
  try {
    await axiosInstance
      .post(`api/sharedspaces/${url}/joinrequest/${id}/resolve`, {
        RoleName,
      });
  } catch (error) {
    throw error;
  }
};

export const deleteJoinRequest = async (
  url: string,
  id: number,
) => {
  try {
    await axiosInstance
      .delete(`api/sharedspaces/${url}/joinrequest/${id}`);
  } catch (error) {
    throw error;
  }
};