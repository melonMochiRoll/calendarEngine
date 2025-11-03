import React, { FC } from 'react';
import SearchResult from './SearchResult';
import SearchInit from './SearchInit';
import { useSearchTodos } from 'Hooks/queries/useSearchTodos';

interface SearchMainProps {
  query: string;
};

const SearchMain: FC<SearchMainProps> = ({
  query,
}) => {
  const { data: todosData, canLoadMore, nextPage } = useSearchTodos(query);
  
  return (
    <>
      {query ?
        <SearchResult
          query={query}
          todosData={todosData}
          canLoadMore={canLoadMore}
          nextPage={nextPage} />
        :
        <SearchInit />}
    </>
  );
};

export default SearchMain;