import React, { FC } from 'react';
import styled from '@emotion/styled';
import gravatar from 'gravatar';

interface ProfileImageProps {
  profileImage?: string,
  email?: string,
  size?: 'large' | 'small',
};

const ProfileImage: FC<ProfileImageProps> = ({
  profileImage,
  email = 'unknown@gmail.com',
  size,
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
      size={renderSize(size)}
      alt={`${email}`}
      src={profileImage ? profileImage : gravatar.url(email, { s: '25px', d: 'retro' })} />
  );
};

export default ProfileImage;

const Img = styled.img<{ size?: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: 35px;
  object-fit: cover;
  cursor: pointer;
`;