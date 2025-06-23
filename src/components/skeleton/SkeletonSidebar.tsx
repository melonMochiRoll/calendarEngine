import React, { FC } from 'react';
import styled from '@emotion/styled';
import { Skeleton } from '@mui/material';

const SkeletonSidebar: FC = () => {
  return (
    <NavBlock>
      {
        Array.from({ length: 4 }, (_, i) => i).map((i) => {
          return (
            <IconButton key={i}>
              <Icon>
                <Skeleton sx={{ bgcolor: 'grey.800' }} animation='wave' variant='circular' width={35} height={35} />
              </Icon>
              <Skeleton sx={{ bgcolor: 'grey.800' }} animation='wave' width={40} height={30} />
            </IconButton>
          );
        })
      }
    </NavBlock>
  );
};

export default SkeletonSidebar;

const NavBlock = styled.nav`
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