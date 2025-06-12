import React, { FC } from 'react';
import styled from '@emotion/styled';
import { Outlet } from 'react-router-dom';
import SharedspaceHeader from './SharedspaceHeader';
import Sidebar from './Sidebar';
import SkeletonHeader from 'Components/skeleton/SkeletonHeader';
import Drawer from 'Components/common/Drawer';
import AsyncBoundary from 'Components/AsyncBoundary';
import TodoContainer from 'Containers/TodoContainer';
import { useAppSelector } from 'Hooks/reduxHooks';
import TodoInit from 'Components/todo/TodoInit';
import LoadingCircular from 'Components/skeleton/LoadingCircular';
import GlobalErrorFallback from 'Components/errors/GlobalErrorFallback';

interface SharedspacesLayoutProps {};

const SharedspacesLayout: FC<SharedspacesLayoutProps> = ({}) => {
  const { todoTime } = useAppSelector(state => state.todoTime);

  return (
    <Block>
      <Sidebar />
      <PageWrapper>
        <AsyncBoundary
          errorBoundaryFallback={GlobalErrorFallback}
          suspenseFallback={<SkeletonHeader />}>
          <SharedspaceHeader />
        </AsyncBoundary>
        <ContentWrapper>
          <Outlet />
          <Drawer>
            {todoTime ?
              <AsyncBoundary
                errorBoundaryFallback={GlobalErrorFallback}
                suspenseFallback={<LoadingCircular />}>
                <TodoContainer />
              </AsyncBoundary> :
              <TodoInit />}
          </Drawer>
        </ContentWrapper>
      </PageWrapper>
    </Block>
  );
};

export default SharedspacesLayout;

const Block = styled.div`
  display: flex;
`;

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  background-color: var(--black);
`;

const ContentWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  height: 95%;
`;