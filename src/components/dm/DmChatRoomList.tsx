import React, { FC } from 'react';
import styled from '@emotion/styled';
import { useDmChatRooms } from 'Src/hooks/queries/useDmChatRooms';
import gravatar from 'gravatar';
import { useNavigate, useParams } from 'react-router-dom';
import { PATHS } from 'Src/constants/paths';
import { useInView } from 'Src/hooks/utils/useInView';
import RefreshIcon from '@mui/icons-material/Refresh';

const DmChatRoomList: FC = () => {
  const navigate = useNavigate();
  const { ChatRoomId: _ChatRoomId } = useParams();

  const {
    data: dmChatRoomsData,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isFetchNextPageError,
  } = useDmChatRooms();

  const sentinelRef = useInView(() => fetchNextPage(), {
    enable: hasNextPage && !isFetchingNextPage && !isFetchNextPageError,
    rootMargin: '100px 0px 0px 0px',
  });

  const handleNavigate = (ChatRoomId: string) => {
    if (_ChatRoomId === ChatRoomId) return;

    navigate(`${PATHS.CHATROOM}/${ChatRoomId}`);
  };

  const chatRooms = dmChatRoomsData.pages.flatMap(page => page.chatRooms);

  return (
    <>
      {
        chatRooms.map(chatRoom => {
          const { previewUsers } = chatRoom;
          const { email, ProfileImage } = previewUsers[0];
          const nicknames = previewUsers.map(user => user.nickname).join(', ');

          return (
            <ChatRoomLi
              key={chatRoom.id}
              active={_ChatRoomId === chatRoom.id}
              onClick={() => handleNavigate(chatRoom.id)}>
              <PreviewIcon src={ProfileImage ? ProfileImage : gravatar.url(email, { s: '45px', d: 'retro' })} />
              <ChatRoomTitle>{chatRoom.name || nicknames}</ChatRoomTitle>
            </ChatRoomLi>
          )
        })
      }
      <div ref={sentinelRef} />
      {
        isFetchNextPageError &&
        <ErrorDiv>
          <ErrorSpan>문제가 발생했습니다.</ErrorSpan>
          <RetryButton onClick={() => fetchNextPage()}>
            <RefreshIcon />
          </RetryButton>
        </ErrorDiv>
      }
    </>
  );
};

export default DmChatRoomList;

const ChatRoomLi = styled.li<{ active?: boolean }>`
  display: flex;
  align-items: center;
  width: 100%;
  height: 75px;
  color: var(--white);
  padding: 10px 10px;
  gap: 10px;
  ${({ active }) => active ? 'background-color: rgba(255, 255, 255, 0.1);' : ''}
  cursor: pointer;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const PreviewIcon = styled.img`
  height: 100%;
  border-radius: 35px;
  object-fit: cover;
`;

const ChatRoomTitle = styled.h1`
  font-size: 20px;
  word-break: keep-all;
  overflow-wrap: break-word;
`;

const ErrorDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 35px 0;
  gap: 10px;
`;

const ErrorSpan = styled.span`
  color: var(--gray-6);
  font-size: 14px;
`;

const RetryButton = styled.button`
  background-color: rgba(0, 0, 0, 0);
  border: none;
  cursor: pointer;

  svg {
    font-size: 45px;
    color: var(--gray-6);

    &:hover {
      color: var(--gray-4);
    }
  }
`;