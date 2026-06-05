import axios, { AxiosError } from "axios";
import { reduxStore } from "Src/store";
import { refreshAuthToken } from "./authApi";
import { CSRF_TOKEN_HEADER_NAME, ERROR_TYPE } from "Src/constants/constants";

export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_SERVER_ORIGIN,
  headers: { "Content-Type" : "application/json" },
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const token = reduxStore.getState().csrfToken.token;

  if (token) {
    config.headers[CSRF_TOKEN_HEADER_NAME] = token;
  }

  return config;
}, error => {
  throw error;
});

axiosInstance.interceptors.response.use(
  (res) => res,
  async (err) => {
    const { config } = err;

    try {
      if (err instanceof AxiosError && err?.response?.data?.metaData?.type === ERROR_TYPE.TOKEN_EXPIRED) {
        const { accessToken } = await refreshAuthToken();

        // TODO: accessToken 전역 저장소에 적재하기

        return axiosInstance(config);
      }
    } catch (refreshError) {
      throw refreshError;
    }

    throw err;
  }
);