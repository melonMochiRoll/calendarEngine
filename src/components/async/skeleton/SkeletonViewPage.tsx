import React, { FC } from 'react';
import styled from '@emotion/styled';
import { Skeleton } from '@mui/material';

const SkeletonViewPage: FC = () => {
  return (
    <PageWrapper>
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
  );
};

export default SkeletonViewPage;

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
