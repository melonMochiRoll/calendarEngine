import React, { FC, useCallback } from 'react';
import styled from '@emotion/styled';
import { logout } from 'Api/authApi';
import { useNavigate } from 'react-router-dom';
import useUser from 'Hooks/useUser';
import TextButton from 'Components/common/TextButton';
import { useQueryClient } from '@tanstack/react-query';
import { GET_USER_KEY } from 'Lib/queryKeys';
import ProfileImage from 'Components/ProfileImage';
import { PATHS } from 'Constants/paths';

const RenderUserProfile: FC = () => {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { userData } = useUser();

  const onLogout = useCallback(() => {
    logout()
      .catch((err) => {
        console.dir(err);
      })
      .finally(() => {
        qc.refetchQueries([GET_USER_KEY]);
      });
  }, []);
  
  return (
    <>
      {
        userData ?
          <>
            <ProfileImage
              profileImage={userData.profileImage}
              email={userData.email} />
            <EmailSpan>{userData.email}</EmailSpan>
            <TextButton
              onClick={() => onLogout()}
              type={'button'}>
                로그아웃
            </TextButton>
          </>
          :
          <>
            <TextButton
              onClick={() => navigate(PATHS.LOGIN)}
              type={'button'}>
                로그인
            </TextButton>
            <TextButton
              onClick={() => navigate(PATHS.JOIN)}
              type={'button'}>
                회원가입
            </TextButton>
          </>
      }
    </>
  );
};

export default RenderUserProfile;

const EmailSpan = styled.span`
  color: var(--white);
  font-size: 16px;
  font-weight: 500;
`;