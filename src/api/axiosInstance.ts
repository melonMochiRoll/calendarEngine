import axios, { AxiosError } from "axios";
import { reduxStore } from "Src/store";
import { refreshAuthToken } from "./authApi";
import { AUTHORIZATION_HEADER_NAME, CSRF_TOKEN_HEADER_NAME, ERROR_TYPE } from "Src/constants/constants";
import { setAccessToken } from "Src/features/accessTokenSlice";

export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_SERVER_ORIGIN,
  headers: { "Content-Type" : "application/json" },
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const accessToken = reduxStore.getState().accessToken.token;
  const csrfToken = reduxStore.getState().csrfToken.token;

  if (accessToken) {
    config.headers[AUTHORIZATION_HEADER_NAME] = `Bearer ${accessToken}`;
  }

  if (csrfToken) {
    config.headers[CSRF_TOKEN_HEADER_NAME] = csrfToken;
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

        config.headers[AUTHORIZATION_HEADER_NAME] = `Bearer ${accessToken}`
        reduxStore.dispatch(setAccessToken({ token: accessToken }));

        return axiosInstance(config);
      }
    } catch (refreshError) {
      throw refreshError;
    }

    throw err;
  }
);