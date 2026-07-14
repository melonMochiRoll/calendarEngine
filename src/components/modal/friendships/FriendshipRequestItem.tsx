import React, { FC, useState } from 'react';
import styled from '@emotion/styled';
import { TFriendship } from 'Src/typings/types';
import ProfileAvatar from 'Src/components/ProfileAvatar';
import { CircularProgress } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { toast } from 'react-toastify';
import { defaultToastOption, waitingMessage } from 'Src/constants/notices';
import { acceptFriendship, rejectFriendship } from 'Src/api/friendshipsApi';
import { useQueryClient } from '@tanstack/react-query';
import { GET_FRIENDSHIP_REQUESTS_KEY } from 'Src/constants/queryKeys';

interface FriendshipRequestItemProps {
  friendshipRequest: TFriendship,
};

const FriendshipRequestItem: FC<FriendshipRequestItemProps> = ({
  friendshipRequest,
}) => {
  const qc = useQueryClient();
  const [ isLoading, setIsLoading ] = useState(false);
  const { email, nickname, ProfileImage, RequesterId } = friendshipRequest;

  const handleAcceptFriendship = async (RequesterId: string) => {
    setIsLoading(true);

    try {
      await acceptFriendship(RequesterId);
      await qc.refetchQueries([GET_FRIENDSHIP_REQUESTS_KEY]);
    } catch (err) {
      toast.error(waitingMessage, defaultToastOption);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRejectFriendship = async (RequesterId: string) => {
    setIsLoading(true);

    try {
      await rejectFriendship(RequesterId);
      await qc.refetchQueries([GET_FRIENDSHIP_REQUESTS_KEY]);
    } catch (err) {
      toast.error(waitingMessage, defaultToastOption);
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
      <ButtonWrapper>
        {
          isLoading ?
            <CircularProgress size={30} />
            :
            <>
              <Button onClick={() => handleAcceptFriendship(RequesterId)}>
                <CheckIcon fontSize='large' sx={{ color: 'var(--naver-green)'}} />
              </Button>
              <Button onClick={() => handleRejectFriendship(RequesterId)}>
                <CloseIcon fontSize='large' sx={{ color: 'var(--red)'}} />
              </Button>
            </>
        }
      </ButtonWrapper>
    </Item>
  );
};

export default FriendshipRequestItem;

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

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20%;
  gap: 12px;
`;

const Button = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.1s linear;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;