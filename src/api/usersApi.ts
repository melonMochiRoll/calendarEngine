import { axiosInstance } from "./axiosInstance";

export const getUser = async () => {
  const { data } = await axiosInstance
    .get('/api/users');
  
  return data;
};

export const isUser = async (email: string) => {
  const { data } = await axiosInstance
    .get(`/api/users/email?e=${email}`);

  return data;
};

export const existsByNickname = async (nickname: string) => {
  const { data } = await axiosInstance
    .get(`/api/users/nickname?n=${nickname}`);

  return data;
};

export const createUser = async (email: string, nickname: string, password: string) => {
  await axiosInstance
    .post(
      '/api/users',
      { email, nickname, password },
    );
};

export const searchUsers = async (
  url: string | undefined,
  query: string,
  page: number,
) => {
  if (!query) {
    return [];
  }

  if (!url) {
    return;
  }
  
  const { data } = await axiosInstance
    .get(`/api/sharedspaces/${url}/users/search?query=${query}&page=${page}`);

  return data;
};

export const generateProfileImagePresignedPutUrl = async (
  id: string,
  fileName: string,
  fileSize: number,
  contentType: string,
): Promise<{ key: string, presignedUrl: string, contentType: string }> => {
  const { data } = await axiosInstance
    .post(
      `/api/users/profileimages/presigned-url`,
      {
        id,
        fileName,
        fileSize,
        contentType,
      },
    );
  return data;
};

export const updateProfileImage = async (
  ImageId: string,
  key: string,
) => {
  await axiosInstance
    .post(
      `/api/users/profileimages`,
      {
        ImageId,
        key,
      },
    );
};