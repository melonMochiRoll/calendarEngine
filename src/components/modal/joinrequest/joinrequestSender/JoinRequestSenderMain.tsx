import React, { FC } from 'react';
import styled from '@emotion/styled';
import useInput from 'Hooks/utils/useInput';
import TextButton from 'Components/common/TextButton';
import { useAppDispatch } from 'Src/hooks/reduxHooks';
import { closeModal } from 'Src/features/modalSlice';
import MailIcon from '@mui/icons-material/MarkEmailRead';
import CloseIcon from '@mui/icons-material/CloseRounded';

interface JoinRequestSenderMainProps {
  onSubmit: (message: string) => void,
  error: string,
};

const JoinRequestSenderMain: FC<JoinRequestSenderMainProps> = ({
  onSubmit,
  error,
}) => {
  const dispatch = useAppDispatch();
  const [ message, onChangeMessage ] = useInput('');

  return (
    <Block onClick={e => e.stopPropagation()}>
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
      <Main>
        <TextField
          value={message}
          onChange={onChangeMessage}
          placeholder='메세지' />
      </Main>
      <Footer>
        <ErrorSpan>{error}</ErrorSpan>
        <Buttons>
          <TextButton
            type='button'
            onClick={() => {
              onSubmit(message);
            }}>
              전송
          </TextButton>
        </Buttons>
      </Footer>
    </Block>
  );
};

export default JoinRequestSenderMain;

const Block = styled.div`
  display: flex;
  flex-direction: column;
  width: 550px;
  height: 350px;
  border-radius: 15px;
  background-color: var(--black);
  box-shadow: 1px 1px 10px 2px #000;
`;

const Main = styled.div`
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