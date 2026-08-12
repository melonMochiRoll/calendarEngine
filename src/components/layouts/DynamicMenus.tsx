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
import AddIcon from '@mui/icons-material/AddRounded';
import useMenu from 'Src/hooks/utils/useMenu';
import { Menu, MenuItem } from '@mui/material';
import { muiMenuDarkModeSx } from 'Src/constants/notices';

const DynamicMenus: FC = () => {
  const navigate = useNavigate();
  const { SharedspaceId, ChatRoomId } = useParams();
  const dispatch = useAppDispatch();
  const { data: spaceData } = useSharedspace();
  const { permission } = spaceData;

  const {
    anchorEl,
    open,
    onOpen,
    onClose,
  } = useMenu();

  const openChatRoomUpdateModal = (
    SharedspaceId: string,
    ChatRoomId: string,
    prevName: string,
  ) => {
    dispatch(openModal({
      name: ModalName.CHATROOM_UPDATER,
      props: {
        SharedspaceId,
        ChatRoomId,
        prevName,
      },
    }));
  };

  const openChatRoomDeleteModal = (
    SharedspaceId: string,
    ChatRoomId: string,
    ChatRoomName: string,
  ) => {
    dispatch(openModal({
      name: ModalName.CHATROOM_DELETER,
      props: {
        SharedspaceId,
        ChatRoomId,
        ChatRoomName,
      },
    }));
  };

  return (
    <>
      <GroupDivider>
        <span>채팅 채널</span>
        <AddIcon onClick={() => {
          dispatch(openModal({
            name: ModalName.CHATROOM_CREATER,
            props: { SharedspaceId: spaceData.id },
          }));
        }} />
      </GroupDivider>
      {
        spaceData.SharedspaceChatRooms.length &&
          <ButtonGroup>
            {
              spaceData.SharedspaceChatRooms.map((chatroom) => {
                const path = `${PATHS.SHAREDSPACE_CHAT}/${SharedspaceId}/${chatroom.id}`;

                return (
                  <>
                    <IconButton
                      key={chatroom.id}
                      active={ChatRoomId === chatroom.id}
                      onClick={() => navigate(path)}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        onOpen(e);
                      }}>
                      <ChatIcon />
                      <span>{chatroom.name}</span>
                    </IconButton>
                    {
                      anchorEl &&
                        <Menu
                          aria-labelledby='demo-positioned-button'
                          anchorEl={anchorEl}
                          open={open}
                          onClick={onClose}
                          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                          transformOrigin={{ vertical: 'center', horizontal: 'center' }}
                          sx={muiMenuDarkModeSx}>
                          <MenuItem
                            onClick={() => openChatRoomUpdateModal(spaceData.id, chatroom.id, chatroom.name)}
                            sx={{ gap: '5px' }}>
                            <span>채팅방 수정</span>
                          </MenuItem>
                          <MenuItem
                            onClick={() => openChatRoomDeleteModal(spaceData.id, chatroom.id, chatroom.name)}
                            sx={{ color: 'var(--red)', gap: '5px' }}>
                            <span>채팅방 삭제</span>
                          </MenuItem>
                        </Menu>
                    }
                  </>
                );
              })
            }
          </ButtonGroup>
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

const GroupDivider = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 5px;
  gap: 10px;
  
  span {
    flex-shrink: 0;
    color: var(--gray-5);
    font-size: 14px;
  }

  svg {
    color: var(--gray-5);
    cursor: pointer;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: 10px;
  gap: 10px;
`;