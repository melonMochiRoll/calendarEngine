import { useQuery } from "@tanstack/react-query";
import { getSharedspace } from "Api/sharedspacesApi";
import { AxiosError } from "axios";
import { GET_SHAREDSPACE_KEY } from "Lib/queryKeys";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { TSharedspaceMetaData } from "Typings/types";

const useSharedspace = () => {
  const { url: _url } = useParams();
  const {
    data,
    isLoading,
    isError,
    refetch,
    error,
  } = useQuery<TSharedspaceMetaData>({
    queryKey: [GET_SHAREDSPACE_KEY],
    queryFn: () => getSharedspace(_url),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    refetch();
  }, [_url]);

  return {
    data,
    error,
    errorCode: error && error instanceof AxiosError ? error.response?.status : 500,
    errorResponse: error instanceof AxiosError ? error.response?.data : null, // TODO: 반환 방법 수정 or 프로퍼티 삭제 고려
    isLoading,
  } as const;
};

export default useSharedspace;