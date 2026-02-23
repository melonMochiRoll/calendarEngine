import React, { FC } from 'react';
import styled from '@emotion/styled';
import { Outlet } from 'react-router-dom';
import Drawer from 'Components/common/Drawer';
import TodoContainer from 'Containers/TodoContainer';
import Sidebar from 'Src/layouts/Sidebar';
import SharedspaceHeader from 'Src/layouts/SharedspaceHeader';

interface SharedspacesLayoutProps {};

const SharedspacesLayout: FC<SharedspacesLayoutProps> = ({}) => {
  return (
    <Block>
      <Sidebar />
      <PageWrapper>
        <SharedspaceHeader />
        <ContentWrapper>
          <Outlet />
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
`;

const ContentWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  height: 95%;
`;