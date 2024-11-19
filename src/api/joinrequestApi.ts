import { axiosInstance } from "./axiosInstance";

export const getJoinRequest = async (
  url: string,
) => {
  try {
    const { data } = await axiosInstance
      .get(`api/sharedspaces/${url}/joinrequest`);

    return data;
  } catch (err) {
    return Promise.reject(err);
  }
};

export const createJoinRequest = async (
  url: string,
  RoleName: string,
  message: string,
) => {
  try {
    await axiosInstance
      .post(`api/sharedspaces/${url}/joinrequest`, {
        RoleName,
        message,
      });
  } catch (err) {
    return Promise.reject(err);
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
  } catch (err) {
    return Promise.reject(err);
  }
};

export const deleteJoinRequest = async (
  url: string,
  id: number,
) => {
  try {
    await axiosInstance
      .delete(`api/sharedspaces/${url}/joinrequest/${id}`);
  } catch (err) {
    return Promise.reject(err);
  }
};