import React, { FC, Suspense, useState } from 'react';
import styled from '@emotion/styled';
import FriendshipsHeader from './FriendshipsHeader';
import FriendshipsMain from './FriendshipsMain';
import { ErrorBoundary } from 'react-error-boundary';
import ModalFallback from 'Src/components/async/fallbackUI/ModalFallback';
import ModalLoadingCircular from 'Src/components/async/skeleton/ModalLoadingCircular';
import { FriendshipTabs } from 'Src/constants/constants';

export interface FriendshipsModalProps {};

const FriendshipsModal: FC = () => {
  const [ currentTab, setCurrentTab ] = useState(FriendshipTabs.LIST);
  const tabs = Object.values(FriendshipTabs);

  const switchTab = (tab: string) => {
    if (currentTab === tab) return;

    setCurrentTab(tab);
  };

  return (
    <Block onClick={e => e.stopPropagation()}>
      <FriendshipsHeader
        tabs={tabs}
        currentTab={currentTab}
        switchTab={switchTab} />
      <ErrorBoundary fallbackRender={(props) => <ModalFallback errorProps={props} />}>
        <Suspense fallback={<ModalLoadingCircular />}>
          <FriendshipsMain currentTab={currentTab} />
        </Suspense>
      </ErrorBoundary>
    </Block>
  );
};

export default FriendshipsModal;

const Block = styled.div`
  display: flex;
  flex-direction: column;
  width: 650px;
  height: 500px;
  border: 1px solid #1d2126;
  border-radius: 15px;
  background-color: var(--black);
  box-shadow: 1px 1px 10px 2px #000;
`;