import React, { FC, Suspense } from 'react';
import ChatContainer from 'Containers/ChatContainer';
import SkeletonChatList from 'Src/components/async/skeleton/SkeletonChatList';

const SharedspacesChatPage: FC = () => {
  return (
    <Suspense fallback={<SkeletonChatList />}>
      <ChatContainer />
    </Suspense>
  );
};

export default SharedspacesChatPage;