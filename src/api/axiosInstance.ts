import axios from "axios";
import { getOrigin } from "Lib/utilFunction";
import { getCsrfTokenFromStore } from "Src/store";

export const axiosInstance = axios.create({
  baseURL: getOrigin(),
  headers: { "Content-Type" : "application/json" },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(config => {
  const token = getCsrfTokenFromStore();

  if (token) {
    config.headers['x-csrf-token'] = token;
  }
  
  return config;
}, error => {
  throw error;
});