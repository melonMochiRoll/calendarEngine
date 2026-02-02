import { axiosInstance } from "./axiosInstance";

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