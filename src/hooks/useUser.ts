import { QueryObserverResult, RefetchOptions, RefetchQueryFilters, useQuery } from '@tanstack/react-query';
import { getUser } from 'Api/usersApi';
import { GET_USER_KEY } from 'Lib/queryKeys';
import { useParams } from 'react-router-dom';
import { SharedspaceMembersRoles, TSharedspace, TUser } from 'Typings/types';

type TypeSafeReturnType = {
  data: TUser;
  isOwner: (url?: string) => boolean;
  hasMemberPermission: (url?: string) => boolean;
  hasViewerPermission: (url?: string) => boolean;
};

type FetchStateReturnType = {
  data: TUser | undefined;
  isLoading: boolean;
  refetch: <TPageData>(
    options?: RefetchOptions & RefetchQueryFilters<TPageData>,
  ) => Promise<QueryObserverResult<TUser, unknown>>;
  isLogin: boolean;
  isNotLogin: boolean;
  isOwner: (url?: string) => boolean;
  hasMemberPermission: (url?: string) => boolean;
  hasViewerPermission: (url?: string) => boolean;
  error: unknown;
};

function useUser(options: { suspense: true, throwOnError: true }): TypeSafeReturnType;
function useUser(options?: { suspense: boolean, throwOnError: boolean }): FetchStateReturnType;

function useUser(options = { suspense: false, throwOnError: false }) {
  const { url: _url } = useParams();
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
  });

  const getRoleName = (url?: string | undefined) => {
    if (data) {
      return data
        .Sharedspacemembers
        .filter((it: { Sharedspace: Pick<TSharedspace, 'url'> }) => it.Sharedspace.url === url || _url)[0]
        ?.Role.name;
    }

    return '';
  };

  const isOwner = (url?: string) => {
    return getRoleName(url) === SharedspaceMembersRoles.OWNER;
  };

  const hasMemberPermission = (url?: string) => {
    const roleName = getRoleName(url);
    const isMember = roleName === SharedspaceMembersRoles.MEMBER;
    const isOwner = roleName === SharedspaceMembersRoles.OWNER;

    return isMember || isOwner;
  };

  const hasViewerPermission = (url?: string) => {
    const roleName = getRoleName(url);

    return Object
      .values(SharedspaceMembersRoles)
      .filter((role: string) => role === roleName).length > 0;
  };

  if (suspense) {
    if (isLoading) throw new Promise(() => {});
    if (error) throw error;
    if (!data) throw new Error();

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