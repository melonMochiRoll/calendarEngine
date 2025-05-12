import React, { FC } from 'react';
import ChatContainer from 'Containers/ChatContainer';
import AsyncBoundary from 'Components/AsyncBoundary';
import GenericErrorFallback from 'Components/errors/GenericErrorFallback';
import SkeletonChatList from 'Components/skeleton/SkeletonChatList';

const SharedspacesChatPage: FC = () => {
  return (
    <AsyncBoundary
      errorBoundaryFallback={GenericErrorFallback}
      suspenseFallback={<SkeletonChatList />}>
      <ChatContainer />
    </AsyncBoundary>
  );
};

export default SharedspacesChatPage;