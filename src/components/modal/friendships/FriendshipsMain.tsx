import React, { FC } from 'react';
import styled from '@emotion/styled';
import FriendshipsListTab from './FriendshipsListTab';
import { FriendshipTabs } from 'Src/constants/constants';
import FriendshipRequestsTab from './FriendshipRequestsTab';
import FriendshipSearchUserTab from './FriendshipSearchUserTab';

interface FriendshipsMainProps {
  currentTab: string,
};

const FriendshipsMain: FC<FriendshipsMainProps> = ({
  currentTab,
}) => {
  const renderTab = (currentTab: string) => {
    if (currentTab === FriendshipTabs.REQUESTS) {
      return <FriendshipRequestsTab />;
    }

    if (currentTab === FriendshipTabs.SEARCH) {
      return <FriendshipSearchUserTab />;
    }

    return <FriendshipsListTab />;
  };

  return (
    <Main>
      {renderTab(currentTab)}
    </Main>
  );
};

export default FriendshipsMain;

const Main = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 85%;
  color: var(--white);
`;