import React, { FC, useState } from 'react';
import styled from '@emotion/styled';
import MailIcon from '@mui/icons-material/MarkEmailRead';
import TextButton from 'Components/common/TextButton';
import { useNavigate, useParams } from 'react-router-dom';
import useInput from 'Hooks/utils/useInput';
import { alreadyRequest, checkURL, defaultToastOption, successMessage, waitingMessage } from 'Constants/notices';
import { createJoinRequest } from 'Api/joinrequestApi';
import { toast } from 'react-toastify';
import { PATHS } from 'Constants/paths';
import WithAuthGuard from 'Components/hoc/WithAuthGuard';

const JoinRequestSenderPage: FC = () => {
  const { url } = useParams();
  const navigate = useNavigate();
  const [ message, onChangeMessage ] = useInput('');
  const [ error, setError ] = useState('');
  
  const onSubmit = (url: string | undefined, message: string) => {
    setError('');

    if (!url) {
      setError(checkURL);
      return;
    }

    createJoinRequest(url, message)
      .then(() => {
        toast.success(successMessage, {
          ...defaultToastOption,
        });
        navigate(PATHS.SHAREDSPACE);
      })
      .catch((error) => {
        const errorMessage = error?.response?.status === 409 ?
          alreadyRequest :
          waitingMessage;
        
        setError(errorMessage);
      });
  };

  return (
    <Background>
      <Wrapper>
        <Header>
          <Left></Left>
          <Center>
            <MailIcon fontSize='large' />
            <ModalTitle>스페이스 액세스 권한 요청</ModalTitle>
          </Center>
          <Right></Right>
        </Header>
        <Body>
          <TextField
            value={message}
            onChange={onChangeMessage}
            placeholder='메세지' />
        </Body>
        <Footer>
          <ErrorSpan>{error}</ErrorSpan>
          <Buttons>
            <TextButton
              type='button'
              onClick={() => onSubmit(url, message)}>
                전송
            </TextButton>
            <TextButton
              type='button'
              onClick={() => {
                navigate(PATHS.SHAREDSPACE);
              }}>
                홈으로
            </TextButton>
          </Buttons>
        </Footer>
      </Wrapper>
    </Background>
  );
};

export default WithAuthGuard(JoinRequestSenderPage);

const Background = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  background-color: var(--dark-gray);
  padding-top: 50px;
`;

const Wrapper = styled.div`
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

const Body = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 65%;
  color: var(--white);
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

const Footer = styled.footer`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 15%;
  padding-left: 15px;
`;

const Buttons = styled.div`
  display: flex;
  align-items: center;
`;

const ErrorSpan = styled.span`
  font-size: 16px;
  color: var(--red);
`;