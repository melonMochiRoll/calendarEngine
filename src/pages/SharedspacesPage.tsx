import React, { FC } from 'react';
import styled from '@emotion/styled';
import Header from 'Containers/Header';
import SubscribedSpacesContainer from 'Containers/SubscribedSpacesContainer';
import WithAuthGuard from 'Components/hoc/WithAuthGuard';

const SharedspacesPage: FC = () => {
  return (
    <Block>
      <Header />
      <Main>
        <SubscribedSpacesContainer />
      </Main>
    </Block>
  );
};

export default WithAuthGuard(SharedspacesPage);

const Block = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: var(--black);
`;

const Main = styled.main`
  display: flex;
  flex-direction: column;
  height: 100%;
`;