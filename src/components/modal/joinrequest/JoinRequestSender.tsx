import React, { FC, useState } from 'react';
import styled from '@emotion/styled';
import CloseIcon from '@mui/icons-material/CloseRounded';
import { closeModal } from 'Features/modalSlice';
import { useAppDispatch } from 'Hooks/reduxHooks';
import MailIcon from '@mui/icons-material/MarkEmailRead';
import TextButton from 'Components/common/TextButton';
import useInput from 'Hooks/useInput';
import { createJoinRequest } from 'Api/joinrequestApi';
import { useParams } from 'react-router-dom';
import { SharedspaceMembersRoles } from 'Typings/types';
import { defaultToastOption, successMessage, waitingMessage } from 'Lib/noticeConstants';
import { toast } from 'react-toastify';

const JoinRequestSender: FC = () => {
  const dispatch = useAppDispatch();
  const { url = '' } = useParams();
  const [ message, onChangeMessage ] = useInput('');
  const [ error, setError ] = useState('');
  
  const onSubmit = (
    url: string,
    RoleName: string,
    message: string,
  ) => {
    setError('');

    if (!url) {
      return setError(waitingMessage);
    }

    createJoinRequest(
      url,
      RoleName,
      message,
    )
      .then(() => {
        toast.success(successMessage, {
          ...defaultToastOption,
        });
        dispatch(closeModal());
      })
      .catch((errorMessage) => {
        setError(errorMessage);
      });
  };

  return (
    <Block
      onClick={e => e.stopPropagation()}>
      <Header>
        <Left></Left>
        <Center>
          <MailIcon fontSize='large' />
          <ModalTitle>액세스 권한 요청</ModalTitle>
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
      <Main>
        <TextfieldDiv>
          <TextField
            value={message}
            onChange={onChangeMessage}
            placeholder='메세지' />
        </TextfieldDiv>
        <ButtonsDiv>
          <ErrorSpan>{error}</ErrorSpan>
          <TextButton
            type='button'
            onClick={() => onSubmit(
              url,
              SharedspaceMembersRoles.MEMBER,
              message,
            )}>
              전송
          </TextButton>
        </ButtonsDiv>
      </Main>
    </Block>
  );
};

export default JoinRequestSender;

const Block = styled.div`
  display: flex;
  flex-direction: column;
  width: 550px;
  height: 350px;
  border-radius: 15px;
  background-color: var(--black);
  box-shadow: 1px 1px 10px 2px #000;
`;

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

const Main = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 80%;
  color: var(--white);
`;

const TextfieldDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 80%;
  border-bottom: 1px solid var(--light-gray);
`;

const TextField = styled.textarea`
  width: 100%;
  height: 100%;
  color: var(--white);
  font-size: 20px;
  padding: 20px;
  border: none;
  outline: none;
  resize: none;
  background-color: var(--black);
`;

const ButtonsDiv = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 20%;
  padding-left: 15px;
`;

const ErrorSpan = styled.span`
  font-size: 16px;
  color: var(--red);
`;