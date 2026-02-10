import { axiosInstance } from "./axiosInstance";

export const getInvites = async (
  page: number,
) => {
  try {
    const { data } = await axiosInstance
      .get(`api/invites?page=${page}`);

    return data;
  } catch (err) {
    throw err;
  }
};

export const sendInvite = async (
  url: string | undefined,
  inviteeEmail: string,
) => {
  try {
    await axiosInstance
      .post(
        `api/invites`,
        {
          url,
          inviteeEmail,
        }
      );
  } catch (err) {
    throw err;
  }
};