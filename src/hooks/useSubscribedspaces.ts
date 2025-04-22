import { useQuery } from "@tanstack/react-query";
import { getSubscribedspaces } from "Api/sharedspacesApi";
import { GET_SUBSCRIBED_SPACES_KEY } from "Lib/queryKeys";
import { useEffect } from "react";
import { TSubscribedspaces } from "Typings/types";
import { useAppSelector } from "./reduxHooks";

const useSubscribedspace = () => {
  const { filter } = useAppSelector(state => state.subscribedspaceFilter);
  const {
    data,
    isLoading,
    refetch,
  } = useQuery<TSubscribedspaces[]>({
    queryKey: [GET_SUBSCRIBED_SPACES_KEY],
    queryFn: () => getSubscribedspaces(filter),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    refetch();
  }, [filter]);

  return {
    data,
    isLoading,
    refetch,
  } as const;
};

export default useSubscribedspace;