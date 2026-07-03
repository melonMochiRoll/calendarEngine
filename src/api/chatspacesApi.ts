import { TChatspaceMembersResponse } from "Src/typings/types";
import { axiosInstance } from "./axiosInstance";

export const getChatspaceMembers = async (
  url: string | undefined,
  beforeUserId?: string,
): Promise<TChatspaceMembersResponse> => {
  if (!url) {
    return { members: [], memberCount: 0, hasMoreData: false };
  }
  
  const { data } = await axiosInstance.get(
    `/api/chatspaces/${url}/members`, {
      params: {
        before: beforeUserId,
      },
    }
  );

  return data;
};