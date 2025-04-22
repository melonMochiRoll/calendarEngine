import { useQuery } from '@tanstack/react-query';
import { getUser } from 'Api/usersApi';
import { GET_USER_KEY } from 'Lib/queryKeys';
import { useParams } from 'react-router-dom';
import { SharedspaceMembersRoles, TSharedspace, TUser } from 'Typings/types';

const useUser = () => {
  const { url: _url } = useParams();
  const {
    data: userData,
    refetch,
    isLoading,
  } = useQuery<TUser>({
    queryKey: [GET_USER_KEY],
    queryFn: () => getUser(),
    refetchOnWindowFocus: false,
  });

  const isOwner = (url?: string): boolean => {
    if (userData) {
      const roleName = userData
        .Sharedspacemembers
        .filter((it: { Sharedspace: Pick<TSharedspace, 'url'> }) => it.Sharedspace.url === url || _url)[0]
        ?.Role.name;

      return roleName === SharedspaceMembersRoles.OWNER;
    }

    return false;
  };

  const hasPermission = (url?: string): boolean => {
    if (userData) {
      const roleName = userData
        .Sharedspacemembers
        .filter((it: { Sharedspace: Pick<TSharedspace, 'url'> }) => it.Sharedspace.url === url || _url)[0]
        ?.Role.name;
      
      return roleName === SharedspaceMembersRoles.MEMBER || roleName === SharedspaceMembersRoles.OWNER;
    }

    return false;
  };

  const getRoleName = (url?: string): string => {
    if (userData) {
      return userData
        .Sharedspacemembers
        .filter((it: { Sharedspace: Pick<TSharedspace, 'url'> }) => it.Sharedspace.url === url || _url)[0]
        ?.Role.name;
    }

    return '';
  };

  return {
    userData,
    refetch,
    isLoading,
    isLogin: Boolean(!isLoading && userData),
    isNotLogin: Boolean(!isLoading && !userData),
    isOwner,
    hasPermission,
    getRoleName,
  } as const;
};

export default useUser;