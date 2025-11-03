import { TSharedspaceMembersRoles } from "Typings/types";
import { axiosInstance } from "./axiosInstance";

export const getSharedspace = async (url: string | undefined) => {
  if (!url) {
    return;
  }

  try {
    const { data } = await axiosInstance
      .get(`/api/sharedspaces/${url}/view`);

    return data;
  } catch (error) {
    throw error;
  }
};

export const getSubscribedspaces = async (
  sort: string,
  page = 1,
) => {
  try {
    const { data } = await axiosInstance
      .get(`/api/sharedspaces/subscribed?sort=${sort}&page=${page}`);

    return data;
  } catch (error) {
    throw error;
  }
};

export const createSharedspace = async (UserId: number) => {
  try {
    const { data } = await axiosInstance
      .post(`api/sharedspaces`, {
        OwnerId: UserId,
      });

    return data;
  } catch (error) {
    throw error;
  }
};

export const updateSharedspaceName = async (
  name: string,
  url: string,
) => {
  try {
    await axiosInstance
      .patch(`api/sharedspaces/${url}/name`, {
        name,
      });
  } catch (error) {
    throw error;
  }
};

export const updateSharedspaceOwner = async (
  url: string | undefined,
  OwnerId: number,
  newOwnerId: number,
) => {
  if (!url) {
    throw new Error;
  }
  
  try {
    await axiosInstance
      .patch(`api/sharedspaces/${url}/owner`, {
        OwnerId,
        newOwnerId
      });
  } catch (error) {
    throw error;
  }
};

export const deleteSharedspace = async (url: string) => {
  try {
    await axiosInstance
      .delete(`/api/sharedspaces/${url}`);
  } catch (error) {
    throw error;
  }
};

export const createSharedspaceMembers = async (
  url: string | undefined,
  UserId: number,
  RoleName: TSharedspaceMembersRoles,
) => {
  if (!url) {
    throw new Error;
  }

  try {
    await axiosInstance
      .post(`/api/sharedspaces/${url}/members`, {
        UserId,
        RoleName,
      });
  } catch (error) {
    throw error;
  }
};

export const updateSharedspaceMembers = async (
  url: string | undefined,
  UserId: number,
  RoleName: TSharedspaceMembersRoles,
) => {
  if (!url) {
    throw new Error;
  }

  try {
    await axiosInstance
      .patch(`/api/sharedspaces/${url}/members`, {
        UserId,
        RoleName,
      })
  } catch (error) {
    throw error;
  }
};

export const updateSharedspacePrivate = async (
  url: string | undefined,
  Private: boolean,
) => {
  if (!url) {
    throw new Error;
  }

  try {
    await axiosInstance
      .patch(`/api/sharedspaces/${url}/private`, {
        private: Private,
      });
  } catch (error) {
    throw error;
  }
};

export const deleteSharedspaceMembers = async (
  url: string | undefined,
  UserId: number,
) => {
  if (!url) {
    throw new Error;
  }

  try {
    await axiosInstance
      .delete(`/api/sharedspaces/${url}/members/${UserId}`);
  } catch (error) {
    throw error;
  }
};

export const getSharedspaceChats = async (
  url: string | undefined,
  page: number,
) => {
  if (!url) {
    return;
  }

  try {
    const { data } = await axiosInstance
      .get(`/api/sharedspaces/${url}/chats?page=${page}`);

    return data;
  } catch (error) {
    throw error;
  }
};

export const createSharedspaceChat = async (
  url: string | undefined,
  formData: FormData,
) => {
  if (!url) {
    throw new Error;
  }

  try {
    await axiosInstance
      .post(`/api/sharedspaces/${url}/chats`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  } catch (error) {
    throw error;
  }
};

export const updateSharedspaceChat = async (
  url: string | undefined,
  ChatId: number,
  oldContent: string,
  newContent: string,
) => {
  if (oldContent === newContent || !url || !newContent) {
    throw new Error;
  }

  try {
    const { data } = await axiosInstance
      .patch(`/api/sharedspaces/${url}/chats`, {
        ChatId,
        content: newContent,
      });

    return data;
  } catch (error) {
    throw error;
  }
};

export const deleteSharedspaceChat = async (
  url: string | undefined,
  ChatId: number,
) => {
  if (!url || !ChatId) {
    throw new Error;
  }

  try {
    await axiosInstance
      .delete(`/api/sharedspaces/${url}/chats/${ChatId}`);
  } catch (error) {
    throw error;
  }
};

export const deleteSharedspaceChatImage = async (
  url: string | undefined,
  ChatId: number,
  ImageId: number,
) => {
  if (!url || !ChatId || !ImageId) {
    throw new Error;
  }

  try {
    await axiosInstance
      .delete(`/api/sharedspaces/${url}/chats/${ChatId}/images/${ImageId}`);
  } catch (error) {
    throw error;
  }
};