import React, { FC, Suspense } from 'react';
import styled from '@emotion/styled';
import { Outlet, useLocation } from 'react-router-dom';
import Drawer from 'Components/common/Drawer';
import TodoContainer from 'Containers/TodoContainer';
import Sidebar from 'Src/layouts/Sidebar';
import SharedspaceHeader from 'Src/layouts/SharedspaceHeader';
import SkeletonHeader from 'Src/components/async/skeleton/SkeletonHeader';
import { ErrorBoundary } from 'react-error-boundary';
import CommonFallback from 'Src/components/async/fallbackUI/CommonFallback';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';

interface SharedspacesLayoutProps {};

const SharedspacesLayout: FC<SharedspacesLayoutProps> = ({}) => {
  const location = useLocation();
  const { reset } = useQueryErrorResetBoundary();

  return (
    <Block>
      <PageWrapper>
        <Suspense fallback={<SkeletonHeader />}>
          <SharedspaceHeader />
        </Suspense>
        <ContentWrapper>
          <Sidebar />
          <ErrorBoundary
            onReset={reset}
            resetKeys={[location.pathname]}
            fallbackRender={(props) => <CommonFallback errorProps={props} />}>
            <Outlet />
          </ErrorBoundary>
          <Drawer>
            <TodoContainer />
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
  overflow: hidden;
`;

const ContentWrapper = styled.div`
  display: flex;
  height: 95%;
`;