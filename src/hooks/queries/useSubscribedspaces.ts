import { useQuery } from "@tanstack/react-query";
import { getSubscribedspaces } from "Api/sharedspacesApi";
import { GET_SUBSCRIBED_SPACES_KEY } from "Constants/queryKeys";
import { handleRetry } from "Lib/utilFunction";
import { TSubscribedspacesResponse } from "Typings/types";

export function useSubscribedspace(
  sort: string,
  page: number,
) {
  const {
    data,
    isLoading,
    error,
  } = useQuery<TSubscribedspacesResponse>({
    queryKey: [GET_SUBSCRIBED_SPACES_KEY, sort, page],
    queryFn: () => getSubscribedspaces(sort, page),
    refetchOnWindowFocus: false,
    suspense: true,
    useErrorBoundary: true,
    retry: (failureCount, error) => handleRetry([ 400, 403, 404 ], failureCount, error),
  });

  if (isLoading) throw new Promise(() => {});
  if (error) throw error;
  if (data === null || data === undefined) throw new Error();

  return { data } as const;
}