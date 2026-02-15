import React, { FC } from 'react';
import styled from '@emotion/styled';
import { closeModal } from 'Features/modalSlice';
import PublicIcon from '@mui/icons-material/Public';
import CloseIcon from '@mui/icons-material/CloseRounded';
import { useAppDispatch } from 'Hooks/reduxHooks';

interface SharedspaceMangerHeaderProps {};

const SharedspaceManagerHeader: FC<SharedspaceMangerHeaderProps> = ({}) => {
  const dispatch = useAppDispatch();

  return (
    <Header>
      <Left></Left>
      <Center>
        <PublicIcon fontSize='large' />
        <ModalTitle>채널 관리</ModalTitle>
      </Center>
      <Right>
        <CloseIcon
          onClick={() => dispatch(closeModal())}
          sx={CloseIconInlineStyle} />
      </Right>
    </Header>
  );
};

export default SharedspaceManagerHeader;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 20%;
  padding: 20px 0;
  border-bottom: 1px solid var(--light-gray);
`;

const Left = styled.div`
  width: 15%;
`;

const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 70%;
  color: var(--white);
  gap: 15px;
`;

const ModalTitle = styled.h1`
  color: var(--white);
  font-size: 24px;
  font-weight 600;
  margin: 0;
`;

const Right = styled.div`
  display: flex;
  justify-content: center;
  width: 15%;
`;

const CloseIconInlineStyle = {
  color: 'var(--white)',
  fontSize: '35px',
  cursor: 'pointer',
};