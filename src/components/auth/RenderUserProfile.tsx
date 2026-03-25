import React, { FC } from 'react';
import styled from '@emotion/styled';
import { logout } from 'Api/authApi';
import { useNavigate } from 'react-router-dom';
import TextButton from 'Components/common/TextButton';
import { useQueryClient } from '@tanstack/react-query';
import { GET_USER_KEY } from 'Constants/queryKeys';
import ProfileImage from 'Components/ProfileImage';
import { PATHS } from 'Constants/paths';
import useUser from 'Src/hooks/queries/useUser';
import { Menu, MenuItem } from '@mui/material';
import useMenu from 'Src/hooks/utils/useMenu';
import LogoutIcon from '@mui/icons-material/Logout';
import { muiMenuDarkModeSx } from 'Src/constants/notices';
import MailIcon from '@mui/icons-material/Mail';
import { useAppDispatch } from 'Src/hooks/reduxHooks';
import { openModal } from 'Src/features/modalSlice';
import { ModalName } from 'Src/typings/types';

interface RenderUserProfileProps {};

const RenderUserProfile: FC<RenderUserProfileProps> = ({}) => {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const dispatch = useAppDispatch();
  const { data: userData } = useUser({ suspense: true, throwOnError: true });

  const {
    anchorEl,
    open,
    onOpen,
    onClose,
  } = useMenu();

  const onLogout = async () => {
    await logout();
    qc.removeQueries([GET_USER_KEY]);
    navigate(PATHS.LOGIN);
  };
  
  return (
    <Block>
      {
        userData ?
          <>
            <ProfileImage
              onClick={onOpen}
              profileImage={userData.profileImage}
              email={userData.email} />
            <Email>{userData.nickname}</Email>
            <Menu
              aria-labelledby='demo-positioned-button'
              anchorEl={anchorEl}
              open={open}
              onClick={onClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              sx={muiMenuDarkModeSx}>
              <MenuItem
                onClick={() => dispatch(openModal({ name: ModalName.SHAREDSPACE_INVITE_RECEIVED }))}
                sx={{ gap: '5px' }}>
                <MailIcon />
                <span>받은 초대</span>
              </MenuItem>
              <MenuItem
                onClick={() => onLogout()}
                sx={{ gap: '5px' }}>
                <LogoutIcon />
                <span>로그아웃</span>
              </MenuItem>
            </Menu>
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
    </Block>
  );
};

export default RenderUserProfile;

const Block = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 30%;
  gap: 15px;
`;

const Email = styled.span`
  color: var(--white);
  font-size: 16px;
  font-weight: 500;
`;