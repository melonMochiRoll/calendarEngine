import { useQuery } from "@tanstack/react-query";
import { getJoinRequest } from "Api/joinrequestApi";
import { GET_JOINREQUEST_KEY } from "Constants/queryKeys";
import { useParams } from "react-router-dom";
import { TJoinRequest } from "Typings/types";

type UseJoinRequestReturnType = {
  data: TJoinRequest[];
};

export function useJoinRequest(): UseJoinRequestReturnType {
  const { url: _url } = useParams();

  const {
    data,
    isLoading,
    error,
  } = useQuery<TJoinRequest[]>({
    queryKey: [GET_JOINREQUEST_KEY, _url],
    queryFn: () => getJoinRequest(_url),
    refetchOnWindowFocus: false,
    suspense: true,
    useErrorBoundary: true,
  });

  if (isLoading) throw new Promise(() => {});
  if (error) throw error;
  if (!data) throw new Error();

  return {
    data,
  };
}