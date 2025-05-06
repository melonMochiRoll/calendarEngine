import { QueryObserverResult, RefetchOptions, RefetchQueryFilters, useQuery } from "@tanstack/react-query";
import { getSubscribedspaces } from "Api/sharedspacesApi";
import { GET_SUBSCRIBED_SPACES_KEY } from "Lib/queryKeys";
import { useEffect } from "react";
import { TSubscribedspaces } from "Typings/types";
import { useAppSelector } from "./reduxHooks";

type TypeSafeReturnType = {
  data: TSubscribedspaces[];
};

type FetchStateReturnType = {
  data: TSubscribedspaces[] | undefined;
  isLoading: boolean;
  refetch: <TPageData>(
    options?: RefetchOptions & RefetchQueryFilters<TPageData>,
  ) => Promise<QueryObserverResult<TSubscribedspaces[], unknown>>;
  error: unknown;
};

function useSubscribedspace(options: { suspense: true, throwOnError: true }): TypeSafeReturnType;
function useSubscribedspace(options?: { suspense: boolean, throwOnError: boolean }): FetchStateReturnType;

function useSubscribedspace(options = { suspense: false, throwOnError: false }) {
  const { filter } = useAppSelector(state => state.subscribedspaceFilter);
  const { suspense, throwOnError } = options;

  const {
    data,
    isLoading,
    refetch,
    error,
  } = useQuery<TSubscribedspaces[]>({
    queryKey: [GET_SUBSCRIBED_SPACES_KEY],
    queryFn: () => getSubscribedspaces(filter),
    refetchOnWindowFocus: false,
    suspense,
    useErrorBoundary: throwOnError,
  });

  useEffect(() => {
    refetch();
  }, [filter]);

  if (suspense) {
    if (isLoading) throw new Promise(() => {});
    if (error) throw error;
    if (!data) throw new Error();

    return { data };
  }

  return {
    data,
    isLoading,
    refetch,
    error,
  };
}

export default useSubscribedspace;