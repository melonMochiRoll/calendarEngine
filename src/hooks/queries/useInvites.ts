import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getInvites } from "Src/api/inviteApi";
import { GET_INVITES_KEY } from "Src/constants/queryKeys";
import { handleRetry } from "Src/lib/utilFunction";
import { TInvitePayload } from "Src/typings/types";

type UseInviteListReturnType = {
  data: TInvitePayload,
  nextPage: () => void;
};

export function useInvites(): UseInviteListReturnType {
  const qc = useQueryClient();
  const [ page, setPage ] = useState(1);

  const {
    data,
    isLoading,
    error,
  } = useQuery<TInvitePayload>({
    queryKey: [GET_INVITES_KEY],
    queryFn: () => getInvites(page),
    refetchOnWindowFocus: false,
    suspense: true,
    useErrorBoundary: true,
    retry: (failureCount, error) => handleRetry([ 400, 401, 403, 404 ], failureCount, error),
  });

  useEffect(() => {
    if (page > 1) {
      getInvites(page)
        .then((res: TInvitePayload) => {
          qc.setQueryData<TInvitePayload>([GET_INVITES_KEY], (prev) => {
            return {
              invites: [ ...prev?.invites || [], ...res.invites ],
              hasMoreData: res.hasMoreData,
            };
          });
        });
    }
  }, [page]);

  if (isLoading) throw new Promise(() => {});
  if (error) throw error;
  if (data === null || data === undefined) throw new Error();

  return {
    data,
    nextPage: () => setPage((prev) => prev + 1),
  };
}