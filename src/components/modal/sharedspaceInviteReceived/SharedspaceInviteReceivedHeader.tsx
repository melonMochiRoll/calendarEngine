import React, { FC } from 'react';
import styled from '@emotion/styled';
import { useAppDispatch } from 'Src/hooks/reduxHooks';
import { closeModal } from 'Src/features/modalSlice';
import CloseIcon from '@mui/icons-material/CloseRounded';
import MailIcon from '@mui/icons-material/Mail';

const SharedspaceInviteReceivedHeader: FC = () => {
  const dispatch = useAppDispatch();

  return (
    <Header>
      <Left></Left>
      <Center>
        <MailIcon fontSize='large' />
        <ModalTitle>받은 초대</ModalTitle>
      </Center>
      <Right>
        <CloseIcon
          onClick={() => dispatch(closeModal())}
          sx={CloseIconInlineStyle} />
      </Right>
    </Header>
  );
};

export default SharedspaceInviteReceivedHeader;

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