import React, { FC, Suspense } from 'react';
import styled from '@emotion/styled';
import SkeletonHeader from 'Src/components/async/skeleton/SkeletonHeader';
import Header from 'Src/layouts/Header';
import DmChatRoomList from 'Src/components/dm/DmChatRoomList';
import { Outlet, useLocation } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import SkeletonDmChatRoomList from 'Src/components/async/skeleton/SkeletonDmChatRoomList';
import DmChatRoomListFallback from 'Src/components/async/fallbackUI/DmChatRoomListFallback';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';

const MainPage: FC = () => {
  const location = useLocation();
  const { reset } = useQueryErrorResetBoundary();

  return (
    <Block>
      <Suspense fallback={<SkeletonHeader />}>
        <Header />
      </Suspense>
      <ContentWrapper>
        <ErrorBoundary
          onReset={reset}
          resetKeys={[location.pathname]}
          fallbackRender={(props) => <DmChatRoomListFallback errorProps={props} />}>
          <DmChatRoomsUl>
            <Suspense fallback={<SkeletonDmChatRoomList />}>
              <DmChatRoomList />
            </Suspense>
          </DmChatRoomsUl>
        </ErrorBoundary>
        <Outlet />
      </ContentWrapper>
    </Block>
  );
};

export default MainPage;

const Block = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
`;

const ContentWrapper = styled.div`
  display: flex;
  height: 100%;
`;

const DmChatRoomsUl = styled.ul`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  align-items: center;
  width: 300px;
  height: 100%;
  margin: 0;
  padding: 0;
  border-right: 2px solid var(--black);
  background-color: var(--dark-gray);
  gap: 15px;
  z-index: 1;
`;