import React, { FC } from 'react';
import styled from '@emotion/styled';
import SearchResult from './SearchResult';
import SearchIcon from '@mui/icons-material/SearchRounded';
import { useSearchTodos } from 'Hooks/queries/useSearchTodos';

interface SearchMainProps {
  query: string,
};

const SearchMain: FC<SearchMainProps> = ({ query }) => {
  const { data: todosData, nextPage } = useSearchTodos(query);
  
  return (
    <Main>
    {
      query ?
        <SearchResult
          query={query}
          todosData={todosData}
          nextPage={nextPage} />
        :
        <SearchIcon sx={{ color: 'var(--light-gray)', fontSize: '250px' }} />
    }
    </Main>
  );
};

export default SearchMain;

const Main = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 85%;
`;