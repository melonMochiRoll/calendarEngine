import React, { FC, Suspense } from 'react';
import styled from '@emotion/styled';
import SharedspaceManagerMain from './SharedspaceManagerMain';
import { ErrorBoundary } from 'react-error-boundary';
import ModalLoadingCircular from 'Src/components/async/skeleton/ModalLoadingCircular';
import ModalFallback from 'Src/components/async/fallbackUI/ModalFallback';
import SharedspaceManagerHeader from './SharedspaceManagerHeader';

interface SharedspaceManagerModalProps {};

const SharedspaceManagerModal: FC<SharedspaceManagerModalProps> = ({}) => {  
  return (
    <Block onClick={e => e.stopPropagation()}>
      <SharedspaceManagerHeader />
      <ErrorBoundary fallbackRender={(props) => <ModalFallback errorProps={props} />}>
        <Suspense fallback={<ModalLoadingCircular />}>
          <SharedspaceManagerMain />
        </Suspense>
      </ErrorBoundary>
    </Block>
  );
};

export default SharedspaceManagerModal;

const Block = styled.div`
  display: flex;
  flex-direction: column;
  width: 650px;
  height: 300px;
  border: 1px solid #1d2126;
  border-radius: 15px;
  background-color: var(--black);
  box-shadow: 1px 1px 10px 2px #000;
`;