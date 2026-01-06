import React, { FC, Suspense } from 'react';
import styled from '@emotion/styled';
import StaticMenus from 'Src/components/layouts/StaticMenus';
import DynamicMenus from 'Src/components/layouts/DynamicMenus';
import SkeletonMenus from 'Src/components/async/skeleton/SkeletonMenus';

const Sidebar: FC = () => {
  return (
    <Nav>
      <StaticMenus />
      <Suspense fallback={<SkeletonMenus length={3} />}>
        <DynamicMenus />
      </Suspense>
    </Nav>
  );
};

export default Sidebar;

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 75px;
  height: 100vh;
  padding: 30px 10px;
  background-color: var(--dark-gray);
  gap: 30px;
  z-index: 1;
`;