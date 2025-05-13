import React, { FC } from 'react';
import styled from '@emotion/styled';
import { CircularProgress } from '@mui/material';

const LoadingPage: FC = () => {
  return (
    <Main>
      <CircleWrapper>
        <CircularProgress size={100} />
      </CircleWrapper>
    </Main>
  );
};

export default LoadingPage;

const Main = styled.main`
  display: flex;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  background-color: var(--black);
`;

const CircleWrapper = styled.div`
  padding-top: 50px;
`;