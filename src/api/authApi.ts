import { AxiosError } from "axios";
import { axiosInstance } from "./axiosInstance";
import { waitingMessage } from "Constants/notices";

export const login = async (email: string, password: string) => {
  try {
    const { data } = await axiosInstance
      .post('/api/auth/login', { username: email, password });

    return data;
  } catch (err) {
    if (err instanceof AxiosError) {
      return Promise.reject(err.response?.data?.message);
    }
    return Promise.reject(waitingMessage);
  }
};

export const logout = async () => {
  try {
    await axiosInstance
      .post('api/auth/logout');
  } catch (err) {
    return Promise.reject(err);
  }
};

export const loginOAuth2Google = async () => {
  try {
    const { data: url } = await axiosInstance
      .get(`/api/auth/login/oauth2/google`);

    return url;
  } catch (err) {
    return Promise.reject(err);
  }
};

export const loginOAuth2Naver = async () => {
  try {
    const { data: url } = await axiosInstance
      .get(`/api/auth/login/oauth2/naver`);

    return url;
  } catch (err) {
    return Promise.reject(err);
  }
};