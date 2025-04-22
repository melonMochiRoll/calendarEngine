import { useQuery } from "@tanstack/react-query";
import { getJoinRequest } from "Api/joinrequestApi";
import { GET_JOINREQUEST_KEY } from "Lib/queryKeys";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { TJoinRequest } from "Typings/types";

const useJoinRequest = () => {
  const { url: _url } = useParams();
  const {
    data,
    refetch,
    isLoading,
  } = useQuery<TJoinRequest[]>({
    queryKey: [GET_JOINREQUEST_KEY],
    queryFn: () => getJoinRequest(_url),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    refetch();
  }, [_url]);

  return {
    data,
    isLoading,
  } as const
};

export default useJoinRequest;