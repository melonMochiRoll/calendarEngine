import React, { FC } from 'react';
import styled from '@emotion/styled';
import SearchIcon from '@mui/icons-material/SearchRounded';

const SearchInit: FC = () => {
  return (
    <Main>
      <SearchIcon sx={{ color: 'var(--light-gray)', fontSize: '250px' }} />
    </Main>
  );
};

export default SearchInit;

const Main = styled.main`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 80%;
`;