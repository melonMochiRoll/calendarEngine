import { useQuery } from "@tanstack/react-query";
import { getSharedspace } from "Api/sharedspacesApi";
import { GET_SHAREDSPACE_KEY } from "Constants/queryKeys";
import { handleRetry } from "Lib/utilFunction";
import { useParams } from "react-router-dom";
import { TSharedspaceMetaData } from "Typings/types";

type UseSharedspaceReturnType = {
  data: TSharedspaceMetaData;
};

export function useSharedspace(): UseSharedspaceReturnType {
  const { url: _url } = useParams();
  const {
    data,
    isLoading,
    error,
  } = useQuery<TSharedspaceMetaData>({
    queryKey: [GET_SHAREDSPACE_KEY, _url],
    queryFn: () => getSharedspace(_url),
    refetchOnWindowFocus: false,
    suspense: true,
    useErrorBoundary: true,
    retry: (failureCount, error) => handleRetry([ 400, 401, 403, 404 ], failureCount, error),
  });

  if (isLoading) throw new Promise(() => {});
  if (error) throw error;
  if (!data) throw new Error();

  return { data };
}