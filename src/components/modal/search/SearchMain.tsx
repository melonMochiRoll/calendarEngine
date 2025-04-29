import React, { FC } from 'react';
import { useAppSelector } from 'Hooks/reduxHooks';
import SearchResult from './SearchResult';
import SearchInit from './SearchInit';
import useSearchTodos from 'Hooks/useSearchTodos';

const SearchMain: FC = () => {
  const { data: todosData, canLoadMore, nextOffset } = useSearchTodos({ suspense: true, throwOnError: true });
  const { query } = useAppSelector(state => state.searchTodos);
  
  return (
    <>
      {query ?
        <SearchResult
          query={query}
          todosData={todosData}
          canLoadMore={canLoadMore}
          nextOffset={nextOffset} />
        :
        <SearchInit />
      }
    </>
  );
};

export default SearchMain;