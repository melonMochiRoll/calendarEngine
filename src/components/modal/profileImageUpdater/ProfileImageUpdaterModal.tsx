import React, { FC } from 'react';
import styled from '@emotion/styled';
import ProfileImageUpdaterHeader from './ProfileImageUpdaterHeader';
import ProfileImageUpdaterMain from './ProfileImageUpdaterMain';

export interface ProfileImageUpdaterModalProps {
  nickname: string,
  ProfileImage: string,
  email: string,
};

const ProfileImageUpdaterModal: FC<ProfileImageUpdaterModalProps> = ({
  nickname,
  ProfileImage,
  email,
}) => {
  return (
    <Block onClick={e => e.stopPropagation()}>
      <ProfileImageUpdaterHeader />
      <ProfileImageUpdaterMain
        nickname={nickname}
        ProfileImage={ProfileImage}
        email={email} />
    </Block>
  );
};

export default ProfileImageUpdaterModal;

const Block = styled.div`
  display: flex;
  flex-direction: column;
  width: 650px;
  height: 500px;
  border: 1px solid #1d2126;
  border-radius: 15px;
  background-color: var(--black);
  box-shadow: 1px 1px 10px 2px #000;
`;