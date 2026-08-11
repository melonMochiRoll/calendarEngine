import React, { FC, useRef, useState } from 'react';
import styled from '@emotion/styled';
import ProfileAvatar from 'Src/components/ProfileAvatar';
import { CircularProgress, Menu, MenuItem } from '@mui/material';
import useMenu from 'Src/hooks/utils/useMenu';
import { defaultToastOption, muiMenuDarkModeSx, waitingMessage } from 'Src/constants/notices';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { TFriendship } from 'Src/typings/types';
import { toast } from 'react-toastify';
import { deleteFriendship } from 'Src/api/friendshipsApi';
import { useQueryClient } from '@tanstack/react-query';
import { GET_FRIENDSHIPS } from 'Src/constants/queryKeys';

interface FriendshipsItemProps {
  friendship: TFriendship,
};

const FriendshipsItem: FC<FriendshipsItemProps> = ({
  friendship,
}) => {
  const qc = useQueryClient();
  const [ isLoading, setIsLoading ] = useState(false);
  const isSubmitting = useRef(false);
  const { email, nickname, ProfileImage, RequesterId } = friendship;

  const {
    anchorEl,
    open,
    onOpen,
    onClose,
  } = useMenu();

  const handleDeleteFriendship = async (
    e: React.MouseEvent<HTMLLIElement, MouseEvent>,
    RequesterId: string,
  ) => {
    if (isSubmitting.current) return;
    onClose(e);

    isSubmitting.current = true;
    setIsLoading(true);

    try {
      await deleteFriendship(RequesterId);
      await qc.refetchQueries([GET_FRIENDSHIPS]);
    } catch (err) {
      toast.error(waitingMessage, defaultToastOption);
    } finally {
      isSubmitting.current = false;
      setIsLoading(false);
    }
  };

  return (
    <Item>
      <ProfileWrapper>
        <ProfileAvatar
          ProfileImage={ProfileImage}
          email={email} />
      </ProfileWrapper>
      <InfoWrapper>
        <InfoNickname>{nickname}</InfoNickname>
        <InfoEmail>{email}</InfoEmail>
      </InfoWrapper>
        <Button onClick={onOpen} disabled={isLoading}>
          {isLoading ? <CircularProgress size={30} /> : <MoreHorizIcon fontSize='large' />}
        </Button>
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
            <MenuItem onClick={(e) => handleDeleteFriendship(e, RequesterId)}>
              <span>친구 삭제</span>
            </MenuItem>
        </Menu>
      }
    </Item>
  );
};

export default FriendshipsItem;

const Item = styled.li`
  display: flex;
  align-items: center;
  width: 100%;
  color: var(--white);
  list-style: none;
  gap: 15px;
  padding: 10px 15px;
  transition: all 0.1s linear;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const ProfileWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 10%;
`;

const InfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 70%;
`;

const InfoNickname = styled.span`
  font-size: 20px;
`;

const InfoEmail = styled.span`
  font-size: 18px;
  color: var(--gray-6);
`;

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--white);
  border: none;
  border-radius: 12px;
  background-color: transparent;
  cursor: pointer;
  transition: all 0.1s linear;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;