import { axiosInstance } from "./axiosInstance";

export const getUser = async () => {
  try {
    const { data } = await axiosInstance
      .get('/api/users');
    
    return data;
  } catch (err) {
    throw err;
  }
};

export const isUser = async (email: string) => {
  try {
    const { data } = await axiosInstance
      .get(`/api/users/email?e=${email}`);

    return data;
  } catch (err) {
    throw err;
  }
};

export const existsByNickname = async (nickname: string) => {
  try {
    const { data } = await axiosInstance
      .get(`/api/users/nickname?n=${nickname}`);

    return data;
  } catch (err) {
    throw err;
  }
};

export const createUser = async (email: string, nickname: string, password: string) => {
  try {
    await axiosInstance
      .post(
        '/api/users',
        { email, nickname, password },
      );
  } catch (err) {
    throw err;
  }
};

export const searchUsers = async (
  url: string | undefined,
  query: string,
  page: number,
) => {
  if (!url || !query) {
    return [];
  }
  
  try {
    const { data } = await axiosInstance
      .get(`/api/sharedspaces/${url}/users/search?query=${query}&page=${page}`);

    return data;
  } catch (err) {
    throw err;
  }
};