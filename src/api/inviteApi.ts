import { TInvitePayload } from "Src/typings/types";
import { axiosInstance } from "./axiosInstance";

export const getInvites = async (
  beforeInviteId?: string,
): Promise<TInvitePayload> => {
  const { data } = await axiosInstance
    .get(`api/invites`, {
      params: {
        before: beforeInviteId,
      },
    });

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