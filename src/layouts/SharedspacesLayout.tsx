import React, { FC } from 'react';
import styled from '@emotion/styled';
import { Outlet } from 'react-router-dom';
import SharedspaceHeader from './SharedspaceHeader';
import Sidebar from './Sidebar';
import SkeletonHeader from 'Components/skeleton/SkeletonHeader';
import Drawer from 'Components/common/Drawer';
import AsyncBoundary from 'Components/AsyncBoundary';
import SharedspaceRedirectFallback from 'Components/errors/SharedspaceRedirectFallback';
import TodoContainer from 'Containers/TodoContainer';
import { useAppSelector } from 'Hooks/reduxHooks';
import TodoInit from 'Components/todo/TodoInit';
import GenericErrorFallback from 'Components/errors/GenericErrorFallback';
import LoadingCircular from 'Components/skeleton/LoadingCircular';

interface SharedspacesLayoutProps {};

const SharedspacesLayout: FC<SharedspacesLayoutProps> = ({}) => {
  const { todoTime } = useAppSelector(state => state.todoTime);

  return (
    <Block>
      <Sidebar />
      <Content>
        <AsyncBoundary
          errorBoundaryFallback={SharedspaceRedirectFallback}
          suspenseFallback={<SkeletonHeader />}>
          <SharedspaceHeader />
        </AsyncBoundary>
        <Main>
          <Outlet />
          <Drawer>
            {todoTime ?
              <AsyncBoundary
                errorBoundaryFallback={GenericErrorFallback}
                suspenseFallback={<LoadingCircular />}>
                <TodoContainer />
              </AsyncBoundary> :
              <TodoInit />}
          </Drawer>
        </Main>
      </Content>
    </Block>
  );
};

export default SharedspacesLayout;

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