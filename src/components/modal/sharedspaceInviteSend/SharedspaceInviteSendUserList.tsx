import React, { FC, memo } from 'react';
import styled from '@emotion/styled';
import ErrorIcon from '@mui/icons-material/ErrorOutline';
import SharedspaceInviteUserItem from './SharedspaceInviteSendUserItem';
import { TSearchUser } from 'Src/typings/types';

interface SharedspaceInviteUserListProps {
  query: string,
  isOwner: boolean,
  searchUsers: TSearchUser[],
  sentinelRef: React.MutableRefObject<HTMLDivElement | null>,
  fetchNextPage: () => void,
  isFetchingNextPage: boolean,
  hasNextPage: boolean,
  isFetchNextPageError: boolean,
}

const SharedspaceInviteUserList: FC<SharedspaceInviteUserListProps> = ({
  query,
  isOwner,
  searchUsers,
  sentinelRef,
  fetchNextPage,
  isFetchingNextPage,
  hasNextPage,
  isFetchNextPageError,
}) => {
  return (
    <>
      {searchUsers.length ?
        <UserList>
          {
            searchUsers.map((user) => {
              return (
                <SharedspaceInviteUserItem
                  key={user.email}
                  user={user}
                  isOwner={isOwner} />
              );
            })
          }
          <SentinelDiv ref={sentinelRef} />
        </UserList>
        :
        <NotFoundBlock>
          <ErrorIcon sx={ErrorInlineStyle} />
          <NotFoundMessage>{`"${query}" 에 대한 검색 결과가 없습니다.`}</NotFoundMessage>
        </NotFoundBlock>
      }
    </>
  );
};

export default memo(SharedspaceInviteUserList);

const UserList = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
`;

const NotFoundBlock = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const ErrorInlineStyle = {
  color: 'var(--white)',
  fontSize: '64px',
  paddingBottom: '15px',
};

const NotFoundMessage = styled.span`
  color: var(--white);
  font-size: 20px;
  font-weight: 600;
`;

const SentinelDiv = styled.div`
  height: 1px;
  flex-shrink: 0;
`;