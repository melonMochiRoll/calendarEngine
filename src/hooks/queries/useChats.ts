import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getSharedspaceChats } from "Api/sharedspacesApi";
import { GET_SHAREDSPACE_CHATS_KEY } from "Constants/queryKeys";
import { handleRetry } from "Lib/utilFunction";
import { debounce } from "lodash";
import { useCallback } from "react";
import { useParams } from "react-router-dom";
import { TChats } from "Typings/types";

export function useChats() {
  const { url: _url } = useParams();
  const qc = useQueryClient();

  const {
    data,
    isLoading,
    error,
  } = useQuery<TChats>({
    queryKey: [GET_SHAREDSPACE_CHATS_KEY, _url],
    queryFn: () => getSharedspaceChats(_url),
    refetchOnWindowFocus: false,
    suspense: true,
    useErrorBoundary: true,
    retry: (failureCount, error) => handleRetry([ 400, 401, 403, 404 ], failureCount, error),
  });

  if (isLoading) throw new Promise(() => {});
  if (error) throw error;
  if (data === null || data === undefined) throw new Error();

  const loadMore = useCallback(debounce(async () => {
    const moreChats = await getSharedspaceChats(_url, data.chats[data.chats.length-1].id);

    qc.setQueryData<TChats>([GET_SHAREDSPACE_CHATS_KEY, _url], (prev) => {
      return {
        ...moreChats,
        chats: [ ...prev?.chats || [], ...moreChats.chats ],
      };
    });
  }, 300), []);

  return {
    data,
    loadMore,
  } as const;
}