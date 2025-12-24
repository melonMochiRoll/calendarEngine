import React, { FC } from 'react';
import styled from '@emotion/styled';
import { CircularProgress } from '@mui/material';

interface ModalLoadingCircularProps {
  idx: number,
  handleClose: () => void,
};

const ModalLoadingCircular: FC<ModalLoadingCircularProps> = ({
  idx,
  handleClose,
}) => {
  return (
    <Backdrop
      key={idx}
      zIndex={100 + idx}
      isBottom={!idx}
      onClick={handleClose}>
      <CircularProgress size={80}/>
    </Backdrop>
  );
};

export default ModalLoadingCircular;

const Backdrop = styled.div<{ zIndex: number, isBottom: boolean }>`
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 100vh;
  background-color: ${({ isBottom }) => isBottom ? 'rgba(0, 0, 0, 0.8)' : ''};
  z-index: ${({ zIndex }) => zIndex};
`;