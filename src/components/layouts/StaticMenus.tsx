import React, { FC } from 'react';
import styled from '@emotion/styled';
import ChatIcon from '@mui/icons-material/Chat';
import CalendarIcon from '@mui/icons-material/CalendarMonth';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { PATHS } from 'Src/constants/paths';

const StaticMenus: FC = () => {
  const navigate = useNavigate();
  const { url } = useParams();
  const location = useLocation();
  const pageName = location.pathname.split('/')[2];

  return (
    <>
      <IconButton
        active={pageName === 'view'}
        onClick={() => navigate(`${PATHS.SHAREDSPACE_VIEW}/${url}`)}>
        <CalendarIcon />
        <span>캘린더</span>
      </IconButton>
      <IconButton
        active={pageName === 'chat'}
        onClick={() => navigate(`${PATHS.SHAREDSPACE_CHAT}/${url}`)}>
        <ChatIcon />
        <span>채팅</span>
      </IconButton>
    </>
  );
};

export default StaticMenus;

const IconButton = styled.div<{ active?: boolean }>`
  display: flex;
  align-items: center;
  height: 35px;
  padding: 5px 10px;
  color: ${({ active }) => active ? 'var(--white)' : 'var(--gray-5)'};
  border-radius: 8px;
  cursor: pointer;
  ${({ active }) => active ? 'background-color: rgba(255, 255, 255, 0.1);' : ''}

  svg {
    margin-right: 10px;
  }

  span {
    font-size: 16px;
    font-weight: 600;
    text-align: center;
  }

  &:hover {
    color: var(--white);
    background-color: rgba(255, 255, 255, 0.2);
  }
`;