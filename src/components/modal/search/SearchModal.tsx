import React, { FC, Suspense, useState } from 'react';
import styled from '@emotion/styled';
import SearchMain from './SearchMain';
import { ErrorBoundary } from 'react-error-boundary';
import ModalLoadingCircular from 'Src/components/async/skeleton/ModalLoadingCircular';
import ModalFallback from 'Src/components/async/fallbackUI/ModalFallback';
import SearchHeader from './SearchHeader';
import { useDebounce } from 'Src/hooks/utils/useDebounce';

interface SearchModalProps {};

const SearchModal: FC<SearchModalProps> = ({}) => {
  const [ query, setQuery ] = useState('');
  const debouncedQuery = useDebounce(query, 500);

  return (
    <Block onClick={e => e.stopPropagation()}>
      <SearchHeader
        query={query} 
        setQuery={setQuery} />
      <ErrorBoundary fallbackRender={(props) => <ModalFallback errorProps={props} />}>
        <Suspense fallback={<ModalLoadingCircular />}>
          <SearchMain query={debouncedQuery}/>
        </Suspense>
      </ErrorBoundary>
    </Block>
  );
};

export default SearchModal;

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