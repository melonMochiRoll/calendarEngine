import React, { FC, useState } from 'react';
import styled from '@emotion/styled';
import ProfileAvatar from 'Src/components/ProfileAvatar';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { CircularProgress } from '@mui/material';
import { TSearchUserForFriendship } from 'Src/typings/types';
import { toast } from 'react-toastify';
import { alreadyRequest, defaultToastOption, waitingMessage } from 'Src/constants/notices';
import { sendFriendship } from 'Src/api/friendshipsApi';
import { AxiosError } from 'axios';

interface FriendshipSearchItemProps {
  user: TSearchUserForFriendship,
};

const FriendshipSearchItem: FC<FriendshipSearchItemProps> = ({
  user,
}) => {
  const [ isLoading, setIsLoading ] = useState(false);
  const [ isSent, setIsSent ] = useState(false);
  const { id, email, nickname, ProfileImage, permission } = user;
  const { isFriendship } = permission;

  const handleSendFriendship = async (RequesteeId: string) => {
    setIsLoading(true);

    try {
      await sendFriendship(RequesteeId);
      setIsSent(true);
    } catch (err) {
      let message = waitingMessage;

      if (err instanceof AxiosError) {
        if (err.response?.status === 409) {
          message = alreadyRequest;
        }
        
        setIsSent(true);
      }

      toast.error(message, defaultToastOption);
    } finally {
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
      {isSent && <DisableButton>요청 보냄</DisableButton>}
      {isLoading && <CircularProgress size={30} />}
      {
        (!isSent && !isLoading) && (
          isFriendship ?
            <DisableButton>친구 상태</DisableButton>
            :
            <Button onClick={() => handleSendFriendship(id)}>
              <GroupAddIcon fontSize='large' />
              친구 요청
            </Button>)
      }
    </Item>
  );
};

export default FriendshipSearchItem;

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

const Button = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 180px;
  font-size: 16px;
  border-radius: 12px;
  cursor: pointer;
  gap: 7px;
  transition: all 0.1s linear;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const DisableButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 180px;
  font-size: 20px;
  color: var(--gray-6);
`;