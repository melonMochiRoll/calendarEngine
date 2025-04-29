import { axiosInstance } from "./axiosInstance";

export const getUser = async () => {
  try {
    const { data } = await axiosInstance
      .get('/api/users');
    
    return data;
  } catch (err) {
    return Promise.reject(err);
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
  } catch (err) {
    return Promise.reject(err);
  }
};

export const searchUsers = async (query: string) => {
  if (!query) return [];
  
  try {
    const { data } = await axiosInstance
      .get(`/api/users/search?query=${query}`);

    return data;
  } catch (err) {
    return Promise.reject(err);
  }
};