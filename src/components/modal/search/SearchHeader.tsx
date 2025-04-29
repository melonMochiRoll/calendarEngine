import React, { FC, useEffect } from 'react';
import styled from '@emotion/styled';
import { useAppDispatch } from 'Hooks/reduxHooks';
import useInput from 'Hooks/useInput';
import { clearQuery, setQuery } from 'Features/searchTodosSlice';
import SearchIcon from '@mui/icons-material/SearchRounded';
import CloseIcon from '@mui/icons-material/CloseRounded';
import { closeModal } from 'Features/modalSlice';

const SearchHeader: FC = () => {
  const dispatch = useAppDispatch();
  const [ query, onChangeQuery ] = useInput('');

  useEffect(() => {
    if (query) {
      const delay = setTimeout(() => {
        dispatch(setQuery({ query }));
      }, 500);

      return () => {
        dispatch(clearQuery());
        clearTimeout(delay);
      };
    }
  }, [query]);

  return (
    <Header>
      <SearchIcon
        fontSize='large'
        sx={{ color: '#66B3FF' }} />
      <Input
        autoFocus
        type='text'
        value={query}
        onChange={onChangeQuery}
        placeholder='검색'/>
      <CloseIcon
        onClick={() => dispatch(closeModal())}
        sx={{
          color: 'var(--white)',
          fontSize: '35px',
          cursor: 'pointer',
        }} />
    </Header>
  );
};

export default SearchHeader;

const Header = styled.header`
  display: flex;
  align-items: center;
  width: 100%;
  height: 15%;
  padding: 20px;
  border-bottom: 1px solid var(--light-gray);
`;

const Input = styled.input`
  width: 100%;
  padding: 0 20px;
  color: var(--white);
  font-size: 24px;
  background-color: var(--black);
  border: none;
  outline: none;
`;