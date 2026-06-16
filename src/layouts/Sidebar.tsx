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
  flex-shrink: 0;
  width: 250px;
  height: 100vh;
  padding: 30px 10px;
  border-right: 2px solid var(--black);
  background-color: var(--dark-gray);
  gap: 20px;
  z-index: 1;
`;