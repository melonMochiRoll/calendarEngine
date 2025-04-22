import { AxiosError } from "axios";
import { axiosInstance } from "./axiosInstance";
import { waitingMessage } from "Lib/noticeConstants";

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
    if (err instanceof AxiosError) {
      return Promise.reject(err.response?.data?.message);
    }
    return Promise.reject(waitingMessage);
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