import { useSuspenseQuery } from "@tanstack/react-query";
import { getSubscribedspaces } from "Api/sharedspacesApi";
import { GET_SUBSCRIBED_SPACES_KEY } from "Constants/queryKeys";
import { handleRetry } from "Lib/utilFunction";
import { TSubscribedspacesResponse } from "Typings/types";

export function useSubscribedspace(
  sort: string,
  page: number,
) {
  const { data } = useSuspenseQuery<TSubscribedspacesResponse>({
    queryKey: [GET_SUBSCRIBED_SPACES_KEY, sort, page],
    queryFn: () => getSubscribedspaces(sort, page),
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => handleRetry([ 400, 401, 403, 404 ], failureCount, error),
  });

  return { data } as const;
}