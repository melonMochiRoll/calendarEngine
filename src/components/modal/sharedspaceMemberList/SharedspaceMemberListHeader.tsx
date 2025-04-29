import React, { FC } from 'react';
import styled from '@emotion/styled';
import CloseIcon from '@mui/icons-material/CloseRounded';
import PeopleIcon from '@mui/icons-material/PeopleAltRounded';
import { useAppDispatch } from 'Hooks/reduxHooks';
import { closeModal } from 'Features/modalSlice';

const SharedspaceMemberListHeader: FC = () => {
  const dispatch = useAppDispatch();

  return (
    <Header>
      <Left></Left>
      <Center>
        <PeopleIcon fontSize='large' />
        <ModalTitle>멤버 목록</ModalTitle>
      </Center>
      <Right>
        <CloseIcon
          onClick={() => dispatch(closeModal())}
          sx={{
            color: 'var(--white)',
            fontSize: '35px',
            cursor: 'pointer',
          }} />
      </Right>
    </Header>
  );
};

export default SharedspaceMemberListHeader;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 15%;
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