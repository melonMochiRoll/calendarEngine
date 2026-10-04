import { useSuspenseQuery } from "@tanstack/react-query";
import { getSharedspace } from "Api/sharedspacesApi";
import { GET_SHAREDSPACE_KEY } from "Constants/queryKeys";
import { handleRetry } from "Lib/utilFunction";
import { useParams } from "react-router-dom";
import { TSharedspaceMetaData } from "Typings/types";

export function useSharedspace() {
  const { SharedspaceId: _SharedspaceId } = useParams();
  const { data } = useSuspenseQuery<TSharedspaceMetaData>({
    queryKey: [GET_SHAREDSPACE_KEY, _SharedspaceId],
    queryFn: () => getSharedspace(_SharedspaceId),
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => handleRetry([ 400, 401, 403, 404 ], failureCount, error),
  });

  return { data } as const;
}