import { QueryObserverResult, RefetchOptions, RefetchQueryFilters, useQuery } from '@tanstack/react-query';
import { getUser } from 'Api/usersApi';
import { GET_USER_KEY } from 'Constants/queryKeys';
import { handleRetry } from 'Lib/utilFunction';
import { TUser } from 'Typings/types';

type TypeSafeReturnType = {
  data: TUser;
};

type FetchStateReturnType = {
  data: TUser | undefined;
  isLoading: boolean;
  refetch: <TPageData>(
    options?: RefetchOptions & RefetchQueryFilters<TPageData>,
  ) => Promise<QueryObserverResult<TUser, unknown>>;
  isLogin: boolean;
  isNotLogin: boolean;
  error: unknown;
};

function useUser(options: { suspense: true, throwOnError: true }): TypeSafeReturnType;
function useUser(options?: { suspense: boolean, throwOnError: boolean }): FetchStateReturnType;

function useUser(options = { suspense: false, throwOnError: false }) {
  const { suspense, throwOnError } = options;

  const {
    data,
    refetch,
    isLoading,
    error,
  } = useQuery<TUser>({
    queryKey: [GET_USER_KEY],
    queryFn: () => getUser(),
    refetchOnWindowFocus: false,
    suspense,
    useErrorBoundary: throwOnError,
    retry: (failureCount, error) => handleRetry([200, 401], failureCount, error),
  });

  if (suspense) {
    if (isLoading) throw new Promise(() => {});
    if (error) throw error;
    if (data === null || data === undefined) throw new Error();

    return {
      data,
    };
  }

  return {
    data,
    refetch,
    isLoading,
    isLogin: Boolean(!isLoading && data),
    isNotLogin: Boolean(!isLoading && !data),
    error,
  };
}

export default useUser;