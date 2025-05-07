import React, { FC } from 'react';
import styled from '@emotion/styled';
import { closeModal } from 'Features/modalSlice';
import MailIcon from '@mui/icons-material/MarkEmailRead';
import CloseIcon from '@mui/icons-material/CloseRounded';
import { useAppDispatch } from 'Hooks/reduxHooks';

const JoinRequestSenderHeader: FC = () => {
  const dispatch = useAppDispatch();

  return (
    <Header>
      <Left></Left>
      <Center>
        <MailIcon fontSize='large' />
        <ModalTitle>스페이스 액세스 권한 요청</ModalTitle>
      </Center>
      <Right>
        <CloseIcon
          onClick={() => dispatch(closeModal())}
          sx={CloseIconInlineStyle} />
      </Right>
    </Header>
  );
};

export default JoinRequestSenderHeader;

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
  color: var(--white);
  width: 70%;
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