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
  SharedspaceId: string,
  inviteeEmail: string,
) => {
  await axiosInstance
    .post(
      `api/invites`,
      {
        SharedspaceId,
        inviteeEmail,
      }
    );
};

export const acceptInvite = async (
  id: string,
  SharedspaceId: string,
) => {
  await axiosInstance
    .post(
      `api/invites/accept`,
      {
        id,
        SharedspaceId,
      }
    );
};

export const declineInvite = async (id: string) => {
  await axiosInstance
    .post(
      `api/invites/decline`,
      {
        id,
      },
    );
};