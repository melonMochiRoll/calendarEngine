import axios from "axios";
import { reduxStore } from "Src/store";

export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_SERVER_ORIGIN,
  headers: { "Content-Type" : "application/json" },
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const token = reduxStore.getState().csrfToken.token;

  if (token) {
    config.headers['x-csrf-token'] = token;
  }

  return config;
}, error => {
  throw error;
});