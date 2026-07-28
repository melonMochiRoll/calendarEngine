import React, { FC } from 'react';
import styled from '@emotion/styled';
import { useAppDispatch } from 'Src/hooks/reduxHooks';
import { openModal } from 'Src/features/modalSlice';
import { ModalName } from 'Src/typings/types';
import PublicIcon from '@mui/icons-material/Public';
import MailIcon from '@mui/icons-material/Mail';
import MailReadIcon from '@mui/icons-material/MarkEmailRead';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { useSharedspace } from 'Src/hooks/queries/useSharedspace';
import ChatIcon from '@mui/icons-material/Chat';
import { useNavigate, useParams } from 'react-router-dom';
import { PATHS } from 'Src/constants/paths';

const DynamicMenus: FC = () => {
  const navigate = useNavigate();
  const { SharedspaceId, ChatRoomId } = useParams();
  const dispatch = useAppDispatch();
  const { data: spaceData } = useSharedspace();
  const { permission } = spaceData;

  return (
    <>
      {
        spaceData.SharedspaceChatRooms.length &&
          <>
            <DividerWithTitle>
              <span>채팅 채널</span>
              <Divider />
            </DividerWithTitle>
            {
              spaceData.SharedspaceChatRooms.map((chatroom) => {
                const path = `${PATHS.SHAREDSPACE_CHAT}/${SharedspaceId}/${chatroom.id}`;

                return (
                  <IconButton
                    key={chatroom.id}
                    active={ChatRoomId === chatroom.id}
                    onClick={() => navigate(path)}>
                    <ChatIcon />
                    <span>{chatroom.name}</span>
                  </IconButton>
                );
              })
            }
            <Divider />
          </>
      }
      {
        permission.isOwner &&
        <IconButton onClick={() => dispatch(openModal({ name: ModalName.SHAREDSPACEMANAGER }))}>
          <PublicIcon />
          <span>채널 관리</span>
        </IconButton>
      }
      {
        permission.isOwner &&
        <IconButton onClick={() => dispatch(openModal({ name: ModalName.JOINREQUEST_MANAGER }))}>
          <MailIcon />
          <span>권한 요청 관리</span>
        </IconButton>
      }
      {
        permission.isMember &&
        <IconButton onClick={() => dispatch(openModal({ name: ModalName.SHAREDSPACE_INVITE_SEND }))}>
          <GroupAddIcon />
          <span>유저 초대</span>
        </IconButton>
      }
      {
        !permission.isMember &&
        <IconButton onClick={() => dispatch(openModal({ name: ModalName.JOINREQUEST_SENDER }))}>
          <MailReadIcon />
          <span>권한 요청</span>
        </IconButton>
      }
    </>
  );
};

export default DynamicMenus;

const IconButton = styled.div<{ active?: boolean }>`
  display: flex;
  align-items: center;
  height: 35px;
  padding: 5px 10px;
  color: ${({ active }) => active ? 'var(--white)' : 'var(--gray-5)'};
  border-radius: 8px;
  cursor: pointer;
  ${({ active }) => active ? 'background-color: rgba(255, 255, 255, 0.1);' : ''}

  svg {
    margin-right: 10px;
  }

  span {
    font-size: 16px;
    font-weight: 600;
    text-align: center;
  }

  &:hover {
    color: var(--white);
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

const DividerWithTitle = styled.div`
  display: flex;
  align-items: center;
  
  span {
    width: 30%;
    flex-shrink: 0;
    color: var(--gray-5);
    font-size: 14px;
  }
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: var(--gray-7);
`;