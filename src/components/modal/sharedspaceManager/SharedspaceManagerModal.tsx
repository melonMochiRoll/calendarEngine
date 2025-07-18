import React, { FC, useState } from 'react';
import styled from '@emotion/styled';
import SharedspaceManagerMain from './SharedspaceManagerMain';
import AsyncBoundary from 'Components/AsyncBoundary';
import SharedspaceManagerHeader from './SharedspaceManagerHeader';
import SharedspaceManagerError from './SharedspaceManagerError';
import LoadingCircular from 'Components/skeleton/LoadingCircular';
import { useDebounce } from 'Hooks/utils/useDebounce';

const SharedspaceManagerModal: FC = () => {
  const [ query, setQuery ] = useState('');
  const debouncedQuery = useDebounce(query, 500);
  
  return (
    <Block onClick={e => e.stopPropagation()}>
      <SharedspaceManagerHeader
        query={query}
        setQuery={setQuery} />
      <AsyncBoundary
        errorRenderComponent={<SharedspaceManagerError message={'에러가 발생했습니다.'} />}
        suspenseFallback={<LoadingCircular />}>
        <SharedspaceManagerMain query={debouncedQuery}/>
      </AsyncBoundary>
    </Block>
  );
};

export default SharedspaceManagerModal;

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