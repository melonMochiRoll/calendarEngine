import { useQuery } from "@tanstack/react-query";
import { TSearchUsers } from "Typings/types";
import { searchUsers } from "Api/usersApi";
import { SEARCH_USERS_KEY } from "Constants/queryKeys";
import { handleRetry } from "Lib/utilFunction";

type UseSearchUsersReturnType = {
  data: TSearchUsers[];
};

export function useSearchUsers(query: string): UseSearchUsersReturnType {
  const {
    data,
    isLoading,
    error,
  } = useQuery<TSearchUsers[]>({
    queryKey: [SEARCH_USERS_KEY, query],
    queryFn: () => searchUsers(query),
    refetchOnWindowFocus: false,
    suspense: true,
    useErrorBoundary: true,
    retry: (failureCount, error) => handleRetry([ 401 ], failureCount, error),
  });

  if (isLoading) throw new Promise(() => {});
  if (error) throw error;
  if (data === null || data === undefined) throw new Error();

  return { data };
}