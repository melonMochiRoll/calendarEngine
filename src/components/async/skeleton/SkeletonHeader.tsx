import React, { FC } from 'react';
import styled from '@emotion/styled';
import { Skeleton } from '@mui/material';

interface SharedspaceHeaderHeaderProps {}; 

const SkeletonHeader: FC<SharedspaceHeaderHeaderProps> = ({}) => {
  return (
    <Block>
      <Left></Left>
      <Right>
        <Skeleton sx={{ bgcolor: 'grey.800' }} animation='wave' variant='circular' width={35} height={35} />
        <Skeleton sx={{ bgcolor: 'grey.800' }} animation='wave' width={100} height={40} />
      </Right>
    </Block>
  );
};

export default SkeletonHeader;

const Block = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  padding: 30px;
  border-bottom: 1px solid var(--light-gray);
  background-color: var(--black);
`;

const Left = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 70%;
`;

const FlexBox = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const RestUserImg = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  color: var(--white);
  width: 35px;
  height: 35px;
  border-radius: 35px;
  background-color: var(--light-gray);
  cursor: pointer;
`;

const Right = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 30%;
  gap: 12px;
`;