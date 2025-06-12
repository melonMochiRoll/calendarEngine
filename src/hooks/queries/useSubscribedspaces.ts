import { useQuery } from "@tanstack/react-query";
import { getSubscribedspaces } from "Api/sharedspacesApi";
import { GET_SUBSCRIBED_SPACES_KEY } from "Constants/queryKeys";
import { handleRetry } from "Lib/utilFunction";
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
    retry: (failureCount, error) => handleRetry([ 400, 401, 403, 404 ], failureCount, error),
  });

  if (isLoading) throw new Promise(() => {});
  if (error) throw error;
  if (data === null || data === undefined) throw new Error();

  return { data };
}