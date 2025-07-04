import { axiosInstance } from "./axiosInstance";

export const login = async (email: string, password: string) => {
  try {
    const { data } = await axiosInstance
      .post('/api/auth/login/jwt', { username: email, password });

    return data;
  } catch (err) {
    throw err;
  }
};

export const logout = async () => {
  try {
    await axiosInstance
      .post('api/auth/logout');
  } catch (err) {
    throw err;
  }
};

export const loginOAuth2Google = async () => {
  try {
    const { data: url } = await axiosInstance
      .get(`/api/auth/login/oauth2/google`);

    return url;
  } catch (err) {
    throw err;
  }
};

export const loginOAuth2Naver = async () => {
  try {
    const { data: url } = await axiosInstance
      .get(`/api/auth/login/oauth2/naver`);

    return url;
  } catch (err) {
    throw err;
  }
};

export const getCsrfToken = async () => {
  try {
    const { data } = await axiosInstance
      .get(`/api/auth/csrf-token`);

    return data.csrfToken;
  } catch (err) {
    throw err;
  }
};