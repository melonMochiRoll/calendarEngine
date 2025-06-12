import { QueryObserverResult, RefetchOptions, RefetchQueryFilters, useQuery } from '@tanstack/react-query';
import { getUser } from 'Api/usersApi';
import { GET_USER_KEY } from 'Constants/queryKeys';
import { handleRetry } from 'Lib/utilFunction';
import { SharedspaceMembersRoles, TSharedspace, TUser } from 'Typings/types';

type TypeSafeReturnType = {
  data: TUser;
  isOwner: (url: string | undefined) => boolean;
  hasMemberPermission: (url: string | undefined) => boolean;
  hasViewerPermission: (url: string | undefined) => boolean;
};

type FetchStateReturnType = {
  data: TUser | undefined;
  isLoading: boolean;
  refetch: <TPageData>(
    options?: RefetchOptions & RefetchQueryFilters<TPageData>,
  ) => Promise<QueryObserverResult<TUser, unknown>>;
  isLogin: boolean;
  isNotLogin: boolean;
  isOwner: (url: string | undefined) => boolean;
  hasMemberPermission: (url: string | undefined) => boolean;
  hasViewerPermission: (url: string | undefined) => boolean;
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
    retry: (failureCount, error) => handleRetry([200], failureCount, error),
  });

  const getRoleName = (url: string | undefined) => {
    if (data && url) {
      return data
        .Sharedspacemembers
        .filter((it: { Sharedspace: Pick<TSharedspace, 'url'> }) => it.Sharedspace.url === url)[0]
        ?.Role.name;
    }

    return '';
  };

  const isOwner = (url: string | undefined) => {
    return getRoleName(url) === SharedspaceMembersRoles.OWNER;
  };

  const hasMemberPermission = (url: string | undefined) => {
    const roleName = getRoleName(url);
    const isMember = roleName === SharedspaceMembersRoles.MEMBER;
    const isOwner = roleName === SharedspaceMembersRoles.OWNER;

    return isMember || isOwner;
  };

  const hasViewerPermission = (url: string | undefined) => {
    const roleName = getRoleName(url);

    return Object
      .values(SharedspaceMembersRoles)
      .filter((role: string) => role === roleName).length > 0;
  };

  if (suspense) {
    if (isLoading) throw new Promise(() => {});
    if (error) throw error;
    if (data === null || data === undefined) throw new Error();

    return {
      data,
      isOwner,
      hasMemberPermission,
      hasViewerPermission,
    };
  }

  return {
    data,
    refetch,
    isLoading,
    isLogin: Boolean(!isLoading && data),
    isNotLogin: Boolean(!isLoading && !data),
    isOwner,
    hasMemberPermission,
    hasViewerPermission,
    error,
  };
}

export default useUser;