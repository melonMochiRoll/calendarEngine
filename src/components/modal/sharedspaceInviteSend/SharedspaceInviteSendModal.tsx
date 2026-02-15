import React, { FC, Suspense, useState } from 'react';
import styled from '@emotion/styled';
import { ErrorBoundary } from 'react-error-boundary';
import ModalLoadingCircular from 'Src/components/async/skeleton/ModalLoadingCircular';
import ModalFallback from 'Src/components/async/fallbackUI/ModalFallback';
import { useDebounce } from 'Src/hooks/utils/useDebounce';
import SharedspaceInviteHeader from './SharedspaceInviteSendHeader';
import SharedspaceInviteMain from './SharedspaceInviteSendMain';

interface SharedspaceInviteModalProps {};

const SharedspaceInviteModal: FC<SharedspaceInviteModalProps> = () => {
  const [ query, setQuery ] = useState('');
  const debouncedQuery = useDebounce(query, 500);
  
  return (
    <Block onClick={e => e.stopPropagation()}>
      <SharedspaceInviteHeader
        query={query} 
        setQuery={setQuery} />
      <ErrorBoundary fallbackRender={(props) => <ModalFallback errorProps={props} />}>
        <Suspense fallback={<ModalLoadingCircular />}>
          <SharedspaceInviteMain query={debouncedQuery} />
        </Suspense>
      </ErrorBoundary>
    </Block>
  );
};

export default SharedspaceInviteModal;

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