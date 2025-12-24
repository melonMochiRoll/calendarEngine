import React, { FC, useState } from 'react';
import styled from '@emotion/styled';
import SearchResult from './SearchResult';
import SearchInit from './SearchInit';
import { useSearchTodos } from 'Hooks/queries/useSearchTodos';
import SearchHeader from './SearchHeader';
import { useDebounce } from 'Src/hooks/utils/useDebounce';
import { useAppDispatch } from 'Src/hooks/reduxHooks';
import { closeModal } from 'Src/features/modalSlice';

interface SearchMainProps {
  idx: number,
};

const SearchMain: FC<SearchMainProps> = ({ idx }) => {
  const dispatch = useAppDispatch();
  const [ query, setQuery ] = useState('');
  const debouncedQuery = useDebounce(query, 500);
  const { data: todosData, nextPage } = useSearchTodos(debouncedQuery);
  
  return (
    <Backdrop
      zIndex={100 + idx}
      isBottom={!idx}
      onClick={() => dispatch(closeModal())}>
      <Block onClick={e => e.stopPropagation()}>
        <SearchHeader
          query={query} 
          setQuery={setQuery} />
        {
          debouncedQuery ?
            <SearchResult
              query={query}
              todosData={todosData}
              nextPage={nextPage} />
            :
            <SearchInit />
        }
        <Footer />
      </Block>
    </Backdrop>
  );
};

export default SearchMain;

const Backdrop = styled.div<{ zIndex: number, isBottom: boolean }>`
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 100vh;
  background-color: ${({ isBottom }) => isBottom ? 'rgba(0, 0, 0, 0.8)' : ''};
  z-index: ${({ zIndex }) => zIndex};
`;

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

const Footer = styled.footer`
  width: 100%;
  height: 5%;
  background-color: var(--black);
  border-top: 1px solid var(--light-gray);
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
`;