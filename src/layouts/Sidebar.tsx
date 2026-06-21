import React, { FC, Suspense } from 'react';
import styled from '@emotion/styled';
import StaticMenus from 'Src/components/layouts/StaticMenus';
import DynamicMenus from 'Src/components/layouts/DynamicMenus';
import SkeletonMenus from 'Src/components/async/skeleton/SkeletonMenus';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';
import { PATHS } from 'Constants/paths';

const Sidebar: FC = () => {
  const navigate = useNavigate();

  return (
    <Nav>
      <IconButton onClick={() => navigate(PATHS.SHAREDSPACE)}>
        <HomeIcon />
        <span>홈으로</span>
      </IconButton>
      <StaticMenus />
      <Suspense fallback={<SkeletonMenus length={3} />}>
        <DynamicMenus />
      </Suspense>
    </Nav>
  );
};

export default Sidebar;

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  width: 250px;
  height: 100%;
  padding: 10px;
  border-right: 2px solid var(--black);
  background-color: var(--dark-gray);
  gap: 20px;
  z-index: 1;
`;

const IconButton = styled.div<{ active?: boolean }>`
  display: flex;
  align-items: center;
  height: 35px;
  padding: 5px 10px;
  color: var(--white);
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