import { axiosInstance } from "./axiosInstance";

export const getChatspaceMembers = async (
  url: string | undefined,
  page: number,
) => {
  if (!url) {
    return;
  }
  
  const { data } = await axiosInstance.get(
    `/api/chatspaces/${url}/members?page=${page}`
  );

  return data;
};