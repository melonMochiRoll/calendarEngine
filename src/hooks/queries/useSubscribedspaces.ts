import { useQuery } from "@tanstack/react-query";
import { getSubscribedspaces } from "Api/sharedspacesApi";
import { GET_SUBSCRIBED_SPACES_KEY } from "Constants/queryKeys";
import { TSubscribedspaces, TSubscribedspacesFilter } from "Typings/types";

type UseSubscribedspaceReturnType = {
  data: TSubscribedspaces[];
};

export function useSubscribedspace(filter: TSubscribedspacesFilter): UseSubscribedspaceReturnType {
  const {
    data,
    isLoading,
    error,
  } = useQuery<TSubscribedspaces[]>({
    queryKey: [GET_SUBSCRIBED_SPACES_KEY, filter],
    queryFn: () => getSubscribedspaces(filter),
    refetchOnWindowFocus: false,
    suspense: true,
    useErrorBoundary: true,
  });

  if (isLoading) throw new Promise(() => {});
  if (error) throw error;
  if (!data) throw new Error();

  return { data };
}