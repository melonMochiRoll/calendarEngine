import React, { FC, useRef } from 'react';
import styled from '@emotion/styled';
import ProfileAvatar from '../ProfileAvatar';
import useMenu from 'Src/hooks/utils/useMenu';
import { Menu, MenuItem } from '@mui/material';
import { TChatRoomParticipant } from 'Src/typings/types';
import { alreadyRequest, defaultToastOption, muiMenuDarkModeSx, waitingMessage } from 'Src/constants/notices';
import { useNavigate } from 'react-router-dom';
import { createDmChatRoom } from 'Src/api/chatroomsApi';
import { PATHS } from 'Src/constants/paths';
import { toast } from 'react-toastify';
import { sendFriendship } from 'Src/api/friendshipsApi';
import { AxiosError } from 'axios';

interface DmChatRoomParticipantsItemProps {
  participant: TChatRoomParticipant,
  UserId: string,
  isMe: boolean,
  isFriend: boolean,
};

const DmChatRoomParticipantItem: FC<DmChatRoomParticipantsItemProps> = ({
  participant,
  UserId,
  isMe,
  isFriend,
}) => {
  const navigate = useNavigate();
  const isSubmitting = useRef(false);

  const {
    anchorEl,
    open,
    onOpen,
    onClose,
  } = useMenu();

  const handleCreateDmChatRoom = async (
    e: React.MouseEvent<HTMLLIElement, MouseEvent>,
    targetUserId: string,
  ) => {
    if (isSubmitting.current) return;
    onClose(e);

    isSubmitting.current = true;

    try {
      const response = await createDmChatRoom(targetUserId);
      
      navigate(`${PATHS.CHATROOM}/${response.ChatRoomId}`);
    } catch (err) {
      toast.error(waitingMessage, defaultToastOption);
    } finally {
      isSubmitting.current = false;
    }
  };

  const handleSendFriendship = async (RequesteeId: string) => {
    if (isSubmitting.current) return;

    isSubmitting.current = true;

    try {
      await sendFriendship(RequesteeId);
    } catch (err) {
      let message = waitingMessage;

      if (err instanceof AxiosError) {
        if (err.response?.status === 409) {
          message = alreadyRequest;
        }
      }

      toast.error(message, defaultToastOption);
    } finally {
      isSubmitting.current = false;
    }
  };

  return (
    <ParticipantLi>
      <ProfileImageWrapper onClick={(e) => !isMe && onOpen(e)}>
        <ProfileAvatar
          ProfileImage={participant.ProfileImage}
          email={participant.email}
          size='large' />
      </ProfileImageWrapper>
      <InfoWrapper>
        <NicknameSpan>{participant.nickname}</NicknameSpan>
        <EmailSpan>{participant.email}</EmailSpan>
      </InfoWrapper>
      {
        anchorEl &&
        <Menu
          aria-labelledby='demo-positioned-button'
          anchorEl={anchorEl}
          open={open}
          onClick={onClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          transformOrigin={{ vertical: 'top', horizontal: 'center' }}
          sx={muiMenuDarkModeSx}>
            <MenuItem onClick={(e) => handleCreateDmChatRoom(e, participant.UserId)}>
              <span>DM</span>
            </MenuItem>
            {
              !isFriend &&
                <MenuItem onClick={() => handleSendFriendship(UserId)}>
                  <span>친구 요청</span>
                </MenuItem>
            }
        </Menu>
      }
    </ParticipantLi>
  );
};

export default DmChatRoomParticipantItem;

const ParticipantLi = styled.li`
  display: flex;
  align-items: center;
  width: 100%;
  height: 65px;
  list-style: none;
  gap: 10px;
`;

const ProfileImageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 15%;
  cursor: pointer;
`;

const InfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 85%;
`;

const NicknameSpan = styled.span`
  font-size: 20px;
  color: var(--gray-3);
`;

const EmailSpan = styled.span`
  font-size: 16px;
  color: var(--gray-6);
`;