import React, { FC } from 'react';
import styled from '@emotion/styled';
import gravatar from 'gravatar';

interface ProfileAvatarProps {
  ProfileImage?: string,
  email?: string,
  size?: 'large' | 'small',
  onClick?: (e?: any) => void,
};

const ProfileAvatar: FC<ProfileAvatarProps> = ({
  ProfileImage,
  email = 'M2NI2n4k49US@gmail.com',
  size,
  onClick,
}) => {

  const renderSize = (size: string | undefined) => {
    if (size === 'large') {
      return '50px';
    }

    if (size === 'small') {
      return '25px';
    }

    return '35px';
  };

  return (
    <Img
      onClick={onClick}
      size={renderSize(size)}
      alt={`${email}`}
      src={ProfileImage ? ProfileImage : gravatar.url(email, { s: '25px', d: 'retro' })} />
  );
};

export default ProfileAvatar;

const Img = styled.img<{ size?: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: 35px;
  object-fit: cover;
  cursor: pointer;
`;