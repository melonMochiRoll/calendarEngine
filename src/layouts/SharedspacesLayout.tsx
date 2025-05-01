import React, { FC } from 'react';
import styled from '@emotion/styled';
import { Outlet } from 'react-router-dom';
import SharedspaceHeader from './SharedspaceHeader';
import Sidebar from './Sidebar';
import SkeletonHeader from 'Components/skeleton/SkeletonHeader';
import Drawer from 'Components/common/Drawer';
import AsyncBoundary from 'Components/AsyncBoundary';
import SharedspaceRedirectFallback from 'Components/errors/SharedspaceRedirectFallback';
import { useQueryClient } from '@tanstack/react-query';
import { GET_SHAREDSPACE_KEY } from 'Lib/queryKeys';
import TodoApp from 'Containers/todo/TodoApp';

interface SharedspacesLayoutProps {};

const SharedspacesLayout: FC<SharedspacesLayoutProps> = ({}) => {
  const qc = useQueryClient();

  return (
    <Block>
      <Sidebar />
      <Content>
        <AsyncBoundary
          errorBoundaryFallback={SharedspaceRedirectFallback}
          suspenseFallback={<SkeletonHeader />}
          onReset={() => {
            qc.removeQueries([GET_SHAREDSPACE_KEY]);
          }}>
          <SharedspaceHeader />
        </AsyncBoundary>
        <Main>
          <Outlet />
          <Drawer>
            <TodoApp />
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