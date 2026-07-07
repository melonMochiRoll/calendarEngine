import { useQuery } from '@tanstack/react-query';
import { getUser } from 'Api/usersApi';
import { GET_USER_KEY } from 'Constants/queryKeys';
import { handleRetry } from 'Lib/utilFunction';
import { TUser } from 'Typings/types';

function useUser() {
  const {
    data,
    isLoading,
    error,
  } = useQuery<TUser>({
    queryKey: [GET_USER_KEY],
    queryFn: () => getUser(),
    refetchOnWindowFocus: true,
    suspense: true,
    useErrorBoundary: true,
    retry: (failureCount, error) => handleRetry([200], failureCount, error),
  });

  if (isLoading) throw new Promise(() => {});
  if (error) throw error;
  if (data === null || data === undefined) throw new Error();

  return { data } as const;
}

export default useUser;