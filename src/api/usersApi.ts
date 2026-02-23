import { axiosInstance } from "./axiosInstance";

export const getUser = async () => {
  try {
    const { data } = await axiosInstance
      .get('/api/users');
    
    return data;
  } catch (error) {
    throw error;
  }
};

export const isUser = async (email: string) => {
  try {
    const { data } = await axiosInstance
      .get(`/api/users/email?e=${email}`);

    return data ? true : false;
  } catch (err) {
    return false;
  }
};

export const createUser = async (email: string, password: string) => {
  try {
    await axiosInstance
      .post('/api/users', { email, password });
  } catch (error) {
    throw error;
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
  } catch (error) {
    throw error;
  }
};