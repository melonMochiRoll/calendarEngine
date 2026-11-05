import React, { FC } from 'react';
import styled from '@emotion/styled';
import SearchResult from './SearchResult';
import SearchIcon from '@mui/icons-material/SearchRounded';
import { useSearchTodos } from 'Hooks/queries/useSearchTodos';
import { useInView } from 'Src/hooks/utils/useInView';

interface SearchMainProps {
  query: string,
};

const SearchMain: FC<SearchMainProps> = ({ query }) => {
  const {
    data: todosData,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isFetchNextPageError,
  } = useSearchTodos(query);

  const sentinelRef = useInView(() => fetchNextPage(), {
    enable: hasNextPage && !isFetchingNextPage && !isFetchNextPageError,
    rootMargin: '100px 0px 0px 0px',
  });

  const todos = todosData.pages.flatMap(page => page.todos);
  
  return (
    <Main>
    {
      query ?
        <SearchResult
          query={query}
          todos={todos}
          sentinelRef={sentinelRef}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          isFetchNextPageError={isFetchNextPageError} />
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