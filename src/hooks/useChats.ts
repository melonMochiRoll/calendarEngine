import { useQuery } from "@tanstack/react-query";
import { getSharedspaceChats } from "Api/sharedspacesApi";
import { GET_SHAREDSPACE_CHATS_KEY } from "Constants/queryKeys";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TChats } from "Typings/types";

type TypeSafeReturnType = {
  data: TChats;
  offset: number;
  setOffset: React.Dispatch<React.SetStateAction<number>>;
};

type FetchStateReturnType = {
  data: TChats | undefined;
  offset: number;
  setOffset: React.Dispatch<React.SetStateAction<number>>;
  isLoading: boolean;
  error: unknown;
};

function useChats(options: { suspense: true, throwOnError: true }): TypeSafeReturnType;
function useChats(options?: { suspense: boolean, throwOnError: boolean }): FetchStateReturnType;

function useChats(options = { suspense: false, throwOnError: false }) {
  const { url: _url } = useParams();
  const { suspense, throwOnError } = options;
  const [ offset, setOffset ] = useState(1);

  const {
    data,
    isLoading,
    refetch,
    error,
  } = useQuery<TChats>({
    queryKey: [GET_SHAREDSPACE_CHATS_KEY],
    queryFn: () => getSharedspaceChats(_url, offset),
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
      offset,
      setOffset,
    };
  }

  return {
    data,
    offset,
    setOffset,
    isLoading,
    error,
  };
}

export default useChats;