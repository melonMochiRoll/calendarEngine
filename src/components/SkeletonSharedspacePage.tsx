import React, { FC } from 'react';
import styled from '@emotion/styled';
import SkeletonHeader from 'Components/skeleton/SkeletonHeader';
import { Skeleton } from '@mui/material';

const SkeletonSharedspacePage: FC = () => {
  return (
    <Background>
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
      <PageWrapper>
        <SkeletonHeader />
        <ContentWrapper>
          <Skeleton sx={{ bgcolor: 'grey.800' }} animation='wave' width={280} height={100} />
          {
            Array.from({ length: 4 }, (_, i) => i).map((i) => {
              return (
                <Skeleton key={i} sx={{ bgcolor: 'grey.800', margin: 0, padding: 0 }} animation='wave' width={1000} height={150} />
              );
            })
          }
        </ContentWrapper>
      </PageWrapper>
    </Background>
  );
};

export default SkeletonSharedspacePage;

const Background = styled.div`
  display: flex;
  height: 100vh;
  justify-content: center;
  background-color: var(--black);
`;

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

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  background-color: var(--black);
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  padding: 20px 80px;
  background-color: var(--black);
`;