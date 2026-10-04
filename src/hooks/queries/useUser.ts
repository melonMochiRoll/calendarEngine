import { useSuspenseQuery } from '@tanstack/react-query';
import { getUser } from 'Api/usersApi';
import { GET_USER_KEY } from 'Constants/queryKeys';
import { handleRetry } from 'Lib/utilFunction';
import { TUser } from 'Typings/types';

function useUser() {
  const { data } = useSuspenseQuery<TUser>({
    queryKey: [GET_USER_KEY],
    queryFn: () => getUser(),
    refetchOnWindowFocus: true,
    retry: (failureCount, error) => handleRetry([ 200, 400, 401, 403 ], failureCount, error),
  });

  return { data } as const;
}

export default useUser;