import React, { FC } from 'react';
import SearchResult from './SearchResult';
import SearchInit from './SearchInit';
import { useSearchTodos } from 'Hooks/useSearchTodos';

interface SearchMainProps {
  query: string;
};

const SearchMain: FC<SearchMainProps> = ({
  query,
}) => {
  const { data: todosData, canLoadMore, nextOffset } = useSearchTodos(query);
  
  return (
    <>
      {query ?
        <SearchResult
          query={query}
          todosData={todosData}
          canLoadMore={canLoadMore}
          nextOffset={nextOffset} />
        :
        <SearchInit />}
    </>
  );
};

export default SearchMain;