import React, { FC } from 'react';
import styled from '@emotion/styled';
import { Skeleton } from '@mui/material';

const SkeletonUserProfile: FC = () => {
  return (
    <Block>
      <Skeleton sx={{ bgcolor: 'grey.800' }} animation='wave' variant='circular' width={35} height={35} />
      <Skeleton sx={{ bgcolor: 'grey.800' }} animation='wave' width={150} height={30} />
      <Skeleton sx={{ bgcolor: 'grey.800' }} animation='wave' width={70} height={30} />
    </Block>
  );
};

export default SkeletonUserProfile;

const Block = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 30%;
  gap: 15px;
`;