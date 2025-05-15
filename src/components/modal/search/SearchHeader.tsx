import React, { FC } from 'react';
import styled from '@emotion/styled';
import { useAppDispatch } from 'Hooks/reduxHooks';
import SearchIcon from '@mui/icons-material/SearchRounded';
import CloseIcon from '@mui/icons-material/CloseRounded';
import { closeModal } from 'Features/modalSlice';

interface SearchHeaderProps {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
};

const SearchHeader: FC<SearchHeaderProps> = ({
  query,
  setQuery,
}) => {
  const dispatch = useAppDispatch();

  return (
    <Header>
      <SearchIcon
        fontSize='large'
        sx={{ color: '#66B3FF' }} />
      <Input
        autoFocus
        type='text'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder='검색'/>
      <CloseIcon
        onClick={() => dispatch(closeModal())}
        sx={CloseIconInlineStyle} />
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

const CloseIconInlineStyle = {
  color: 'var(--white)',
  fontSize: '35px',
  cursor: 'pointer',
};