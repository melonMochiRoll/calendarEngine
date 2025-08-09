import React, { FC } from 'react';
import ChatContainer from 'Containers/ChatContainer';
import AsyncBoundary from 'Components/AsyncBoundary';
import SkeletonChatList from 'Components/skeleton/SkeletonChatList';
import { SharedspaceFallback } from 'Src/components/errors/SharedspaceFallback';

const SharedspacesChatPage: FC = () => {
  return (
    <AsyncBoundary
      errorBoundaryFallback={SharedspaceFallback}
      suspenseFallback={<SkeletonChatList />}>
      <ChatContainer />
    </AsyncBoundary>
  );
};

export default SharedspacesChatPage;