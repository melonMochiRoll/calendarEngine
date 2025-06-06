import { useQuery } from "@tanstack/react-query";
import { getSharedspace } from "Api/sharedspacesApi";
import { GET_SHAREDSPACE_KEY } from "Constants/queryKeys";
import { handleRetry } from "Lib/utilFunction";
import { useParams } from "react-router-dom";
import { TSharedspaceMetaData } from "Typings/types";

type TypeSafeReturnType = {
  data: TSharedspaceMetaData;
};

type FetchStateReturnType = {
  data: TSharedspaceMetaData | undefined;
  isLoading: boolean;
  error: unknown;
};

function useSharedspace(options: { suspense: true, throwOnError: true }): TypeSafeReturnType;
function useSharedspace(options?: { suspense: boolean, throwOnError: boolean }): FetchStateReturnType;

function useSharedspace(options = { suspense: false, throwOnError: false }) {
  const { suspense, throwOnError } = options;

  const { url: _url } = useParams();
  const {
    data,
    isLoading,
    error,
  } = useQuery<TSharedspaceMetaData>({
    queryKey: [GET_SHAREDSPACE_KEY, _url],
    queryFn: () => getSharedspace(_url),
    refetchOnWindowFocus: false,
    suspense,
    useErrorBoundary: throwOnError,
    retry: (failureCount, error) => handleRetry([ 400, 401, 403, 404 ], failureCount, error),
  });

  if (suspense) {
    if (isLoading) throw new Promise(() => {});
    if (error) throw error;
    if (!data) throw new Error();

    return { data };
  }

  return { data, isLoading, error };
}

export default useSharedspace;