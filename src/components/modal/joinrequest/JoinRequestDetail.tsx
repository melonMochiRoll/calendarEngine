import React, { FC } from 'react';
import styled from '@emotion/styled';
import CloseIcon from '@mui/icons-material/CloseRounded';
import { useAppDispatch } from 'Hooks/reduxHooks';
import { TJoinRequest } from 'Typings/types';
import { closeModal } from 'Features/modalSlice';

export interface JoinRequestDetailProps {
  request: TJoinRequest;
};

const JoinRequestDetail: FC<JoinRequestDetailProps> = ({
  request,
}) => {
  const dispatch = useAppDispatch();
  
  return (
    <Block
      onClick={e => e.stopPropagation()}>
      <Header>
        <Left></Left>
        <Center>
          <ModalTitle>{request.Requestor.email}</ModalTitle>
        </Center>
        <Right>
          <CloseIcon
            onClick={() => dispatch(closeModal())}
            sx={CloseIconInlineStyle} />
        </Right>
      </Header>
      <Body>
        <Span>{request.message}</Span>
      </Body>
    </Block>
  );
};

export default JoinRequestDetail;

const Block = styled.div`
  display: flex;
  flex-direction: column;
  width: 450px;
  min-height: 300px;
  border-radius: 15px;
  background-color: var(--black);
  box-shadow: 1px 1px 5px 1px #000;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 60px;
  padding: 20px 0;
  border-bottom: 1px solid var(--light-gray);
`;

const Left = styled.div`
  width: 15%;
`;

const Center = styled.div`
  display: flex;
  justify-content: center;
  width: 70%;
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

const Body = styled.section`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 80%;
  padding: 20px;
  color: var(--white);
`;

const Span = styled.span`
  font-size: 20px;
  word-wrap: break-all;
  word-break: break-all;
`;

const CloseIconInlineStyle = {
  color: 'var(--white)',
  fontSize: '35px',
  cursor: 'pointer',
};