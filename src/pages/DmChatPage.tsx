import React, { FC, Suspense } from 'react';
import styled from '@emotion/styled';
import Drawer from 'Src/components/common/Drawer';
import DmChatRoomParticipantList from 'Src/components/dm/DmChatRoomParticipantList';
import DmChatContainer from 'Src/containers/DmChatContainer';
import LoadingPage from 'Src/components/async/skeleton/LoadingPage';
import { ErrorBoundary } from 'react-error-boundary';
import CommonFallback from 'Src/components/async/fallbackUI/CommonFallback';
import { useParams } from 'react-router-dom';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';

const DmChatPage: FC = ({}) => {
  const { ChatRoomId: _ChatRoomId } = useParams();
  const { reset } = useQueryErrorResetBoundary();

  return (
    <Block>
      <ContentWrapper>
        <ErrorBoundary
          onReset={reset}
          resetKeys={[_ChatRoomId]}
          fallbackRender={(props) => <CommonFallback errorProps={props} />}>
          <Suspense fallback={<LoadingPage />}>
            <DmChatContainer />
            <Drawer>
              <DmChatRoomParticipantList />
            </Drawer>
          </Suspense>
        </ErrorBoundary>
      </ContentWrapper>
    </Block>
  );
};

export default DmChatPage;

const Block = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  background-color: var(--black);
`;

const ContentWrapper = styled.div`
  display: flex;
  height: 100%;
`;