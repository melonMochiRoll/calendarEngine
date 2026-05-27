import { axiosInstance } from "./axiosInstance";

export const getInvites = async (
  page: number,
) => {
  const { data } = await axiosInstance
    .get(`api/invites?page=${page}`);

  return data;
};

export const sendInvite = async (
  url: string,
  inviteeEmail: string,
) => {
  await axiosInstance
    .post(
      `api/invites`,
      {
        url,
        inviteeEmail,
      }
    );
};

export const acceptInvite = async (
  id: string,
  url: string,
) => {
  await axiosInstance
    .post(
      `api/invites/accept`,
      {
        id,
        url,
      }
    );
};

export const declineInvite = async (
  id: string,
  url: string,
) => {
  await axiosInstance
    .post(
      `api/invites/decline`,
      {
        id,
        url,
      },
    );
};