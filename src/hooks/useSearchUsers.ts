import { useQuery } from "@tanstack/react-query";
import { useAppSelector } from "./reduxHooks";
import { TSearchUsers } from "Typings/types";
import { searchUsers } from "Api/usersApi";
import { useEffect } from "react";
import { SEARCH_USERS_KEY } from "Lib/queryKeys";

type TypeSafeReturnType = {
  data: TSearchUsers[];
};

type FetchStateReturnType = {
  data: TSearchUsers[] | undefined;
  isLoading: boolean;
  error: unknown;
};

function useSearchUsers(options: { suspense: true, throwOnError: true }): TypeSafeReturnType;
function useSearchUsers(options?: { suspense: boolean, throwOnError: boolean }): FetchStateReturnType;

function useSearchUsers(options = { suspense: false, throwOnError: false }) {
  const { query } = useAppSelector(state => state.searchUsers);
  const { suspense, throwOnError } = options;

  const {
    data,
    isLoading,
    refetch,
    error,
  } = useQuery<TSearchUsers[]>({
    queryKey: [SEARCH_USERS_KEY],
    queryFn: () => searchUsers(query),
    refetchOnWindowFocus: false,
    suspense,
    useErrorBoundary: throwOnError,
  });

  useEffect(() => {
    refetch();
  }, [query]);

  if (suspense) {
    if (isLoading) throw new Promise(() => {});
    if (error) throw error;
    if (!data) throw new Error();

    return { data };
  }

  return { data, isLoading, error };
}

export default useSearchUsers;