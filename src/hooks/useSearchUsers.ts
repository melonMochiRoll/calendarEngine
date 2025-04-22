import { useQuery } from "@tanstack/react-query";
import { useAppSelector } from "./reduxHooks";
import { TSearchUsers } from "Typings/types";
import { searchUsers } from "Api/usersApi";
import { useEffect } from "react";
import { SEARCH_USERS_KEY } from "Lib/queryKeys";

const useSearchUsers = () => {
  const { query } = useAppSelector(state => state.searchUsers);

  const {
    data,
    isLoading,
    refetch,
  } = useQuery<TSearchUsers[]>({
    queryKey: [SEARCH_USERS_KEY],
    queryFn: () => searchUsers(query),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    refetch();
  }, [query]);

  return {
    data,
    isLoading
  } as const;
};

export default useSearchUsers;