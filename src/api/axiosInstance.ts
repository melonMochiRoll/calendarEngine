import axios, { AxiosError } from "axios";
import { reduxStore } from "Src/store";
import { refreshAuthToken } from "./authApi";
import { AUTHORIZATION_HEADER_NAME, CSRF_TOKEN_HEADER_NAME, ERROR_TYPE } from "Src/constants/constants";
import { setAccessToken } from "Src/features/accessTokenSlice";
import { jwtDecode } from "jwt-decode";
import { TAccessTokenPayload } from "Src/typings/types";
import dayjs from "dayjs";

export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_SERVER_ORIGIN,
  headers: { "Content-Type" : "application/json" },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(async (config) => {
  const accessToken = reduxStore.getState().accessToken.token;
  const csrfToken = reduxStore.getState().csrfToken.token;

  if (csrfToken) {
    config.headers[CSRF_TOKEN_HEADER_NAME] = csrfToken;
  }

  if (accessToken) {
    const accessTokenPayload = jwtDecode<TAccessTokenPayload>(accessToken);
    const isExpired = dayjs().isSameOrAfter(dayjs(accessTokenPayload.exp, 'X'));

    if (isExpired) {
      try {
        const { data }: { data: { accessToken: string }} = await axios
          .post(
            `${process.env.REACT_APP_SERVER_ORIGIN}/api/auth/refresh`,
            {},
            {
              headers: { "Content-Type" : "application/json" },
              withCredentials: true,
            }
          );
        
        config.headers[AUTHORIZATION_HEADER_NAME] = `Bearer ${data.accessToken}`;
        reduxStore.dispatch(setAccessToken({ token: data.accessToken }));
      } finally {
        return config;
      }
    }

    config.headers[AUTHORIZATION_HEADER_NAME] = `Bearer ${accessToken}`;
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