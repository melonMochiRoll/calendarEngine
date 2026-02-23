import React, { FC } from 'react';
import styled from '@emotion/styled';
import { Skeleton } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';

const SkeletonSubscribedspacesItem: FC = () => (
  <Item>
    <ItemPrivate>
      <Skeleton sx={{ bgcolor: 'grey.800', fontSize: '28px' }} animation='wave'>
        <LockIcon />
      </Skeleton>
    </ItemPrivate>
    <ItemTitle>
      <Skeleton sx={{ bgcolor: 'grey.800', fontSize: '28px' }} animation='wave' width='75%' />
    </ItemTitle>
    <ItemOwner>
      <Skeleton sx={{ bgcolor: 'grey.800', fontSize: '28px' }} animation='wave' width='70%' />
    </ItemOwner>
    <ItemMoreMenu />
  </Item>
);

export default SkeletonSubscribedspacesItem;

const Item = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 20px 30px;
  color: var(--white);
  border-bottom: 1px solid var(--light-gray);
  transition: all 0.3s;
  cursor: pointer;

  &:hover {
    background-color: var(--light-gray);
  }
`;

const ItemPrivate = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 10%;
  font-size: 20px;
  text-align: center;
  gap: 5px;
`;

const ItemTitle = styled.div`
  width: 45%;
  margin: 0;
  font-size: 28px;
`;

const ItemOwner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 25%;
  font-size: 20px;
  text-align: center;
  cursor: pointer;
`;

const ItemMoreMenu = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 5%;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s;

  svg {
    border-radius: 25px;

    &:hover {
      background-color: rgba(255, 255, 255, 0.2);
    }
  }
`;