import { useQuery } from "@tanstack/react-query";
import { getSharedspace } from "Api/sharedspacesApi";
import { GET_SHAREDSPACE_KEY } from "Lib/queryKeys";
import { useEffect } from "react";
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
    refetch,
    error,
  } = useQuery<TSharedspaceMetaData>({
    queryKey: [GET_SHAREDSPACE_KEY],
    queryFn: () => getSharedspace(_url),
    refetchOnWindowFocus: false,
    suspense,
    useErrorBoundary: throwOnError,
  });

  useEffect(() => {
    refetch();
  }, [_url]);

  if (suspense) {
    if (isLoading) throw new Promise(() => {});
    if (error) throw error;
    if (!data) throw new Error();

    return { data };
  }

  return { data, isLoading, error };
}

export default useSharedspace;