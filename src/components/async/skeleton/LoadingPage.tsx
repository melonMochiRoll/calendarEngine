import React, { FC } from 'react';
import styled from '@emotion/styled';
import LoadingCircular from './LoadingCircular';

const LoadingPage: FC = () => {
  return (
    <Main>
      <LoadingCircular />
    </Main>
  );
};

export default LoadingPage;

const Main = styled.main`
  display: flex;
  height: 100vh;
  justify-content: center;
  background-color: var(--black);
`;