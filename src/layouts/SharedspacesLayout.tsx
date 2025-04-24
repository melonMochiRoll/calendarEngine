import React from 'react';
import styled from '@emotion/styled';
import { Outlet } from 'react-router-dom';
import Sidebar from 'Containers/Sidebar';
import SharedspaceHeader from 'Containers/SharedspaceHeader';
import SkeletonSharedspaceHeader from 'Components/skeleton/SkeletonSharedspaceHeader';
import TodoContainer from 'Containers/TodoContainer';
import useSharedspace from 'Hooks/useSharedspace';
import WithSharedspaceRedirect from 'Components/hoc/WithSharedspaceRedirect';

const SharedspacesLayout = () => {
  const {
    data: spaceData,
    isLoading,
  } = useSharedspace();

  return (
    <Block>
      <Sidebar />
      <Content>
        {
          !isLoading && spaceData ?
            <SharedspaceHeader
              spaceData={spaceData} /> :
            <SkeletonSharedspaceHeader />
        }
        <Main>
          <Outlet />
          <TodoContainer />
        </Main>
      </Content>
    </Block>
  );
};

export default WithSharedspaceRedirect(SharedspacesLayout);

const Block = styled.div`
  display: flex;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  background-color: var(--black);
`;

const Main = styled.main`
  display: flex;
  justify-content: space-between;
  height: 95%;
`;