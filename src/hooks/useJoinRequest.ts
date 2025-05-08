import { useQuery } from "@tanstack/react-query";
import { getJoinRequest } from "Api/joinrequestApi";
import { GET_JOINREQUEST_KEY } from "Constants/queryKeys";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { TJoinRequest } from "Typings/types";

type TypeSafeReturnType = {
  data: TJoinRequest[];
};

type FetchStateReturnType = {
  data: TJoinRequest[] | undefined;
  isLoading: boolean;
  error: unknown;
};

function useJoinRequest(options: { suspense: true, throwOnError: true }): TypeSafeReturnType;
function useJoinRequest(options?: { suspense: boolean, throwOnError: boolean }): FetchStateReturnType;

function useJoinRequest(options = { suspense: false, throwOnError: false }) {
  const { url: _url } = useParams();
  const { suspense, throwOnError } = options;

  const {
    data,
    refetch,
    isLoading,
    error,
  } = useQuery<TJoinRequest[]>({
    queryKey: [GET_JOINREQUEST_KEY],
    queryFn: () => getJoinRequest(_url),
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

    return {
      data,
    };
  }

  return {
    data,
    isLoading,
    error,
  };
}

export default useJoinRequest;