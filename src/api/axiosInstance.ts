import axios from "axios";
import { getOrigin } from "Lib/utilFunction";

export const axiosInstance = axios.create({
  baseURL: getOrigin(),
  headers: { "Content-Type" : "application/json" },
  withCredentials: true,
});