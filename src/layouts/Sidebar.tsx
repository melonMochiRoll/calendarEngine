import React, { FC } from 'react';
import styled from '@emotion/styled';
import HomeIcon from '@mui/icons-material/Home';
import ChatIcon from '@mui/icons-material/Chat';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch } from 'Hooks/reduxHooks';
import { openModal } from 'Features/modalSlice';
import { ModalName } from 'Typings/types';
import PublicIcon from '@mui/icons-material/Public';
import MailIcon from '@mui/icons-material/Mail';
import MailReadIcon from '@mui/icons-material/MarkEmailRead';
import useUser from 'Hooks/useUser';
import { PATHS } from 'Constants/paths';

const Sidebar: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { url } = useParams();
  const { isOwner, hasMemberPermission } = useUser({ suspense: false, throwOnError: false });
  const pageName = location.pathname.split('/')[2];
  
  return (
    <Block>
      <IconButton onClick={() => navigate(`${PATHS.SHAREDSPACE_VIEW}/${url}`)}>
        <Icon active={pageName === 'view'}>
          <HomeIcon fontSize='large' />
        </Icon>
        <span>홈</span>
      </IconButton>
      <IconButton onClick={() => navigate(`${PATHS.SHAREDSPACE_CHAT}/${url}`)}>
        <Icon active={pageName === 'chat'}>
          <ChatIcon />
        </Icon>
        <span>채팅</span>
      </IconButton>
      {
        isOwner() &&
        <IconButton onClick={() => dispatch(openModal({ name: ModalName.SHAREDSPACEMANAGER }))}>
          <Icon>
            <PublicIcon />
          </Icon>
          <span>채널 관리</span>
        </IconButton>
      }
      {
        isOwner() &&
        <IconButton onClick={() => dispatch(openModal({ name: ModalName.JOINREQUEST_MANAGER }))}>
          <Icon>
            <MailIcon />
          </Icon>
          <span>권한 요청 관리</span>
        </IconButton>
      }
      {
        !hasMemberPermission() &&
        <IconButton onClick={() => dispatch(openModal({ name: ModalName.JOINREQUEST_SENDER }))}>
          <Icon>
            <MailReadIcon />
          </Icon>
          <span>권한 요청</span>
        </IconButton>
      }
    </Block>
  );
};

export default Sidebar;

const Block = styled.nav`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 75px;
  height: 100vh;
  padding: 30px 10px;
  background-color: var(--dark-gray);
  gap: 30px;
  z-index: 1;
`;

const IconButton = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: var(--white);
  cursor: pointer;

  span {
    font-size: 14px;
    padding-top: 5px;
    text-align: center;
  }
`;

const Icon = styled.div<{ active?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 35px;
  height: 35px;
  border-radius: 8px;
  ${({ active }) => active ? 'background-color: rgba(255, 255, 255, 0.1);' : ''}

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;