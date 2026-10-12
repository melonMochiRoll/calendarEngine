import React, { FC, Suspense } from 'react';
import ChatContainer from 'Containers/ChatContainer';
import { ErrorBoundary } from 'react-error-boundary';
import SkeletonChatList from 'Src/components/async/skeleton/SkeletonChatList';
import CommonFallback from 'Src/components/async/fallbackUI/CommonFallback';

const SharedspacesChatPage: FC = () => {
  return (
    <ErrorBoundary fallbackRender={(props) => <CommonFallback errorProps={props} />}>
      <Suspense fallback={<SkeletonChatList />}>
        <ChatContainer />
      </Suspense>
    </ErrorBoundary>
  );
};

export default SharedspacesChatPage;