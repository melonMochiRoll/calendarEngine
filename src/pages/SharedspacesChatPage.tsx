import React, { FC } from 'react';
import ChatContainer from 'Containers/ChatContainer';
import AsyncBoundary from 'Components/AsyncBoundary';
import SkeletonChatList from 'Components/skeleton/SkeletonChatList';
import GlobalErrorFallback from 'Components/errors/GlobalErrorFallback';

const SharedspacesChatPage: FC = () => {
  return (
    <AsyncBoundary
      errorBoundaryFallback={GlobalErrorFallback}
      suspenseFallback={<SkeletonChatList />}>
      <ChatContainer />
    </AsyncBoundary>
  );
};

export default SharedspacesChatPage;