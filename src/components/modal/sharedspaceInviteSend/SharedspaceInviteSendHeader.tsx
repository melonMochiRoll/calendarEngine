import React, { FC } from 'react';
import styled from '@emotion/styled';
import SearchIcon from '@mui/icons-material/SearchRounded';
import CloseIcon from '@mui/icons-material/CloseRounded';
import { closeModal } from 'Src/features/modalSlice';
import { useAppDispatch } from 'Src/hooks/reduxHooks';

interface SharedspaceInviteHeaderProps {
  query: string,
  setQuery: React.Dispatch<React.SetStateAction<string>>,
};

const SharedspaceInviteHeader: FC<SharedspaceInviteHeaderProps> = ({
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
        placeholder='유저 검색'/>
      <CloseIcon
        onClick={() => dispatch(closeModal())}
        sx={CloseIconInlineStyle} />
    </Header>
  );
};

export default SharedspaceInviteHeader;

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