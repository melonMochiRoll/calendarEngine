import React, { FC, useState } from 'react';
import styled from '@emotion/styled';
import ProfileImage from 'Src/components/ProfileImage';
import { TSearchUsersItem } from 'Src/typings/types';
import { useParams } from 'react-router-dom';
import { sendInvite } from 'Src/api/inviteApi';
import { CircularProgress } from '@mui/material';

interface SharedspaceInviteUserItemProps {
  user: TSearchUsersItem,
  isOwner: boolean,
};

const SharedspaceInviteUserItem: FC<SharedspaceInviteUserItemProps> = ({
  user,
  isOwner,
}) => {
  const { url } = useParams();
  const [ isLoading, setIsLoading ] = useState(false);
  const [ isSent, setIsSent ] = useState('');
  const { email, profileImage, permission } = user;
  const label = isSent || '이미 속한 유저';

  const handleSendInvite = async () => {
    setIsLoading(true);

    try {
      await sendInvite(url, email);
      setIsSent('초대 요청 보냄');
    } catch (err) {
      setIsSent('이미 요청 보냄');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Item>
      <ProfileWrapper>
        <ProfileImage
          profileImage={profileImage}
          email={email} />
      </ProfileWrapper>
      <EmailWrapper>
        <EmailText>{email}</EmailText>
      </EmailWrapper>
      {
        isLoading ?
          <CircularProgress size={30} />
          :
          isOwner && !isSent && !permission.isParticipant ?
            <Button onClick={() => handleSendInvite()}>
              초대
            </Button>
            :
            <DisableButton>{label}</DisableButton>
      }
    </Item>
  );
};

export default SharedspaceInviteUserItem;

const Item = styled.li`
  display: flex;
  align-items: center;
  width: 100%;
  color: var(--white);
  list-style: none;
  gap: 15px;
  padding: 10px 15px;

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

const EmailWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 70%;
`;

const EmailText = styled.span`
  font-size: 20px;
`;

const DisableButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20%;
  font-size: 20px;
  color: #828282;
`;

const Button = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20%;
  font-size: 20px;
  cursor: pointer;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;