import React, { FC } from 'react';
import styled from '@emotion/styled';
import { CircularProgress } from '@mui/material';

const ModalLoadingCircular: FC = () => {
  return (
    <Block>
      <CircularProgress size={100}/>
    </Block>
  );
};

export default ModalLoadingCircular;

const Block = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 100vh;
`;