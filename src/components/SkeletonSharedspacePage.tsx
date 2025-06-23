import React, { FC } from 'react';
import styled from '@emotion/styled';
import SkeletonHeader from 'Components/skeleton/SkeletonHeader';
import { Skeleton } from '@mui/material';
import SkeletonSidebar from './skeleton/SkeletonSidebar';

const SkeletonSharedspacePage: FC = () => {
  return (
    <Background>
      <SkeletonSidebar />
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