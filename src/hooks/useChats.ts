import { useQuery } from "@tanstack/react-query";
import { getSharedspaceChats } from "Api/sharedspacesApi";
import { GET_SHAREDSPACE_CHATS_KEY } from "Lib/queryKeys";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TChats } from "Typings/types";

const useChats = () => {
  const { url: _url } = useParams();
  const [ offset, setOffset ] = useState(1);
  const {
    data,
    isLoading,
    refetch,
  } = useQuery<TChats>({
    queryKey: [GET_SHAREDSPACE_CHATS_KEY],
    queryFn: () => getSharedspaceChats(_url, offset),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    refetch();
  }, [_url]);

  return {
    data,
    isLoading,
    offset,
    setOffset,
  } as const;
};

export default useChats;