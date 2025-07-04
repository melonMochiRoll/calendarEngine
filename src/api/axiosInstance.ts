import axios from "axios";
import { getOrigin } from "Lib/utilFunction";
import { reduxStore } from "Src/store";

export const axiosInstance = axios.create({
  baseURL: getOrigin(),
  headers: { "Content-Type" : "application/json" },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(async (config) => {
  const token = reduxStore.getState().csrfToken.token;

  if (token) {
    config.headers['x-csrf-token'] = token;
  }

  return config;
}, error => {
  throw error;
});