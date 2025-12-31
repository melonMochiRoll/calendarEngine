import React, { FC } from 'react';
import styled from '@emotion/styled';
import { CircularProgress } from '@mui/material';

interface ModalLoadingCircularProps {};

const ModalLoadingCircular: FC<ModalLoadingCircularProps> = ({}) => {
  return (
    <Main>
      <CircularProgress size={80}/>
    </Main>
  );
};

export default ModalLoadingCircular;

const Main = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 85%;
  padding-bottom: 15px;
  color: var(--white);
`;