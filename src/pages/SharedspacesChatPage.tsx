import React, { FC, Suspense } from 'react';
import ChatContainer from 'Containers/ChatContainer';
import { ErrorBoundary } from 'react-error-boundary';
import SkeletonChatList from 'Src/components/async/skeleton/SkeletonChatList';
import SharedspaceFallback from 'Src/components/async/fallbackUI/SharedspaceFallback';

const SharedspacesChatPage: FC = () => {
  return (
    <ErrorBoundary fallbackRender={(props) => <SharedspaceFallback errorProps={props} />}>
      <Suspense fallback={<SkeletonChatList />}>
        <ChatContainer />
      </Suspense>
    </ErrorBoundary>
  );
};

export default SharedspacesChatPage;