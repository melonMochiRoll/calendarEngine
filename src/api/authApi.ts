import axios from "axios";
import { axiosInstance } from "./axiosInstance";

export const login = async (email: string, password: string) => {
  const { data } = await axiosInstance
    .post('/api/auth/login/jwt', { email, password });

  return data;
};

export const logout = async () => {
  await axiosInstance
    .post('api/auth/logout');
};

export const loginOAuth2Google = async () => {
  const { data: url } = await axiosInstance
    .get(`/api/auth/login/oauth2/google`);

  return url;
};

export const loginOAuth2Naver = async () => {
  const { data: url } = await axiosInstance
    .get(`/api/auth/login/oauth2/naver`);

  return url;
};

export const getCsrfToken = async () => {
  const { data } = await axiosInstance
    .get(`/api/auth/csrf-token`);

  return data.csrfToken;
};

export const refreshAuthToken = async () => {
  const { data }: { data: { accessToken: string }} = await axios
    .post(
      `${process.env.REACT_APP_SERVER_ORIGIN}/api/auth/refresh`,
      {},
      {
        headers: { "Content-Type" : "application/json" },
        withCredentials: true,
      },
    );
    
  return { newAccessToken: data.accessToken };
};