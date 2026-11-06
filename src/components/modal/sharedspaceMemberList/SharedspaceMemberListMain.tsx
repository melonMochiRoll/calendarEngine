import React, { FC } from 'react';
import styled from '@emotion/styled';
import MemberItem from './MemberItem';
import { useSharedspacemembers } from 'Src/hooks/queries/useSharedspacemembers';
import { useSharedspace } from 'Src/hooks/queries/useSharedspace';
import useUser from 'Src/hooks/queries/useUser';
import { useInView } from 'Src/hooks/utils/useInView';

interface SharedspaceMemberListMainProps {};

const SharedspaceMemberListMain: FC<SharedspaceMemberListMainProps> = ({}) => {
  const {
    data: membersData,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isFetchNextPageError,
  } = useSharedspacemembers();
  const { data: spaceData } = useSharedspace();
  const { data: userData } = useUser();

  const sentinelRef = useInView(() => fetchNextPage(), {
    enable: hasNextPage && !isFetchingNextPage && !isFetchNextPageError,
    rootMargin: '100px 0px 0px 0px',
  });

  const members = membersData.pages.flatMap(page => page.members);
  
  return (
    <Main>
      <List>
        {members.map((member) => {
          return (
            <MemberItem
              key={member.UserId}
              item={member}
              isOwner={spaceData.permission.isOwner}
              isMe={userData.id === member.UserId} />
          );
        })}
        <SentinelDiv ref={sentinelRef} />
      </List>
    </Main>
  );
};

export default SharedspaceMemberListMain;

const Main = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 85%;
  color: var(--white);
`;

const List = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 0;
  padding-bottom: 1%;
  margin: 0;
  overflow-y: auto;
`;

const ErrorSpan = styled.span`
  font-size: 16px;
  color: var(--red);
`;

const SentinelDiv = styled.div`
  height: 1px;
  flex-shrink: 0;
`;