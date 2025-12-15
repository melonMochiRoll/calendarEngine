import React, { FC } from 'react';
import styled from '@emotion/styled';
import { Skeleton } from '@mui/material';

interface SkeletonChatProps {
  email: number,
  content: number,
};

const SkeletonChat: FC<SkeletonChatProps> = ({
  email,
  content,
}) => {
  return (
    <Block>
      <Left>
        <Skeleton variant="circular" width={35} height={35} sx={{ bgcolor: 'grey.800' }} />
      </Left>
      <Right>
        <Top>
          <Skeleton variant='text' width={`${email}px`} sx={{ bgcolor: 'grey.800', fontSize: '20px' }} />
          <Skeleton variant='text' width='50px' sx={{ bgcolor: 'grey.800', fontSize: '16px' }}/>
        </Top>
        <Bottom>
          <Skeleton variant='text' width={`${content}px`} sx={{ bgcolor: 'grey.800', fontSize: '18px' }} />
        </Bottom>
      </Right>
    </Block>
  );
};

export default SkeletonChat;

const Block = styled.li`
  display: flex;
  padding: 5px 20px;
  gap: 15px;

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

const Left = styled.div`
  display: flex;
  justify-content: center;
`;

const Right = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 5px;
`;

const Top = styled.div`
  display: flex;
  align-items: flex-end;
  width: 100%;
  gap: 10px;
`;

const Bottom = styled.div`
  display: flex;
  width: 90%;
`;