import { useQuery } from "@tanstack/react-query";
import { getSharedspaceChats } from "Api/sharedspacesApi";
import { GET_SHAREDSPACE_CHATS_KEY } from "Constants/queryKeys";
import { handleRetry } from "Lib/utilFunction";
import { useParams } from "react-router-dom";
import { TChats } from "Typings/types";

type UseChatsReturnType = {
  data: TChats;
};

export function useChats(offset: number): UseChatsReturnType {
  const { url: _url } = useParams();

  const {
    data,
    isLoading,
    error,
  } = useQuery<TChats>({
    queryKey: [GET_SHAREDSPACE_CHATS_KEY, _url],
    queryFn: () => getSharedspaceChats(_url, offset),
    refetchOnWindowFocus: false,
    suspense: true,
    useErrorBoundary: true,
    retry: (failureCount, error) => handleRetry([ 400, 401, 403, 404 ], failureCount, error),
  });

  if (isLoading) throw new Promise(() => {});
  if (error) throw error;
  if (!data) throw new Error();

  return {
    data,
  };
}