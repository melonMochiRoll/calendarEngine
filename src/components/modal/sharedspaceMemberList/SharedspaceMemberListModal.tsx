import React, { FC, Suspense } from 'react';
import styled from '@emotion/styled';
import SharedspaceMemberListMain from './SharedspaceMemberListMain';
import { ErrorBoundary } from 'react-error-boundary';
import ModalLoadingCircular from 'Src/components/async/skeleton/ModalLoadingCircular';
import ModalFallback from 'Src/components/async/fallbackUI/ModalFallback';
import SharedspaceMemberListHeader from './SharedspaceMemberListHeader';

interface SharedspaceMemberListModalProps {};

const SharedspaceMemberListModal: FC<SharedspaceMemberListModalProps> = ({}) => {
  return (
    <Block onClick={e => e.stopPropagation()}>
      <SharedspaceMemberListHeader />
      <ErrorBoundary fallbackRender={(props) => <ModalFallback errorProps={props} />}>
        <Suspense fallback={<ModalLoadingCircular />}>
          <SharedspaceMemberListMain />
        </Suspense>
      </ErrorBoundary>
    </Block>
  );
};

export default SharedspaceMemberListModal;

const Block = styled.div`
  display: flex;
  flex-direction: column;
  width: 650px;
  height: 500px;
  padding-bottom: 1%;
  border-radius: 15px;
  background-color: var(--black);
  box-shadow: 1px 1px 10px 2px #000;
`;