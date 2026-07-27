import { TChatspaceMembersResponse } from "Src/typings/types";
import { axiosInstance } from "./axiosInstance";

export const getChatspaceMembers = async (
  SharedspaceId: string | undefined,
  beforeUserId?: string,
): Promise<TChatspaceMembersResponse> => {
  if (!SharedspaceId) {
    return { members: [], memberCount: 0, hasMoreData: false };
  }
  
  const { data } = await axiosInstance.get(
    `/api/chatspaces/${SharedspaceId}/members`, {
      params: {
        before: beforeUserId,
      },
    }
  );

  return data;
};