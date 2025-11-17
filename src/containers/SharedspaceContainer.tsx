import React, { FC, Suspense } from 'react';
import styled from '@emotion/styled';
import { Outlet } from 'react-router-dom';
import SkeletonHeader from 'Components/skeleton/SkeletonHeader';
import Drawer from 'Components/common/Drawer';
import TodoContainer from 'Containers/TodoContainer';
import { useAppSelector } from 'Hooks/reduxHooks';
import TodoInit from 'Components/todo/TodoInit';
import LoadingCircular from 'Components/skeleton/LoadingCircular';
import SkeletonSidebar from 'Components/skeleton/SkeletonSidebar';
import Sidebar from 'Src/layouts/Sidebar';
import SharedspaceHeader from 'Src/layouts/SharedspaceHeader';

const SharedspaceContainer: FC = () => {
  const { todoTime } = useAppSelector(state => state.todoTime);

  return (
    <Block>
      <Suspense fallback={<SkeletonSidebar />}>
        <Sidebar />
      </Suspense>
      <PageWrapper>
        <Suspense fallback={<SkeletonHeader />}>
          <SharedspaceHeader />
        </Suspense>
        <ContentWrapper>
          <Outlet />
          <Drawer>
            {todoTime ?
              <Suspense fallback={<LoadingCircular />}>
                <TodoContainer />
              </Suspense> :
              <TodoInit />}
          </Drawer>
        </ContentWrapper>
      </PageWrapper>
    </Block>
  );
};

export default SharedspaceContainer;

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