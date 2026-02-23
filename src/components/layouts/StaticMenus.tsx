import React, { FC } from 'react';
import styled from '@emotion/styled';
import HomeIcon from '@mui/icons-material/Home';
import ChatIcon from '@mui/icons-material/Chat';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { PATHS } from 'Src/constants/paths';

const StaticMenus: FC = () => {
  const navigate = useNavigate();
  const { url } = useParams();
  const location = useLocation();
  const pageName = location.pathname.split('/')[2];

  return (
    <>
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
    </>
  );
};

export default StaticMenus;

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