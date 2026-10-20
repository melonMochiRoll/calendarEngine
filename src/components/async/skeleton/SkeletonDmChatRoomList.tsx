import React, { FC } from 'react';
import styled from '@emotion/styled';
import { Skeleton } from '@mui/material';

const SkeletonDmChatRoomList: FC = () => {
  const skeleton = [
    { previewUsers: 100 },
    { previewUsers: 150 },
    { previewUsers: 130 },
    { previewUsers: 120 },
    { previewUsers: 130 },
  ];

  return (
    <>
      {
        skeleton.map((v: typeof skeleton[0], idx: number) => {
          return (
            <Li key={idx}>
              <Skeleton variant="circular" width={55} height={55} sx={{ bgcolor: 'grey.800' }} />
              <Skeleton variant='text' width={`${v.previewUsers}px`} sx={{ bgcolor: 'grey.800', fontSize: '20px' }} />
            </Li>
          );
        })
      }
    </>
  );
};

export default SkeletonDmChatRoomList;

const Li = styled.li`
  display: flex;
  align-items: center;
  width: 100%;
  height: 75px;
  color: var(--white);
  padding: 10px 10px;
  gap: 10px;
`;