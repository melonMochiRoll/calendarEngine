import React, { FC } from 'react';
import styled from '@emotion/styled';
import useInput from 'Hooks/useInput';
import TextButton from 'Components/common/TextButton';

interface JoinRequestSenderMainProps {
  onSubmit: (message: string ) => void;
  error: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
};

const JoinRequestSenderMain: FC<JoinRequestSenderMainProps> = ({
  onSubmit,
  error,
  setError,
}) => {
  const [ message, onChangeMessage ] = useInput('');

  return (
    <>
      <Main>
        <TextField
          value={message}
          onChange={onChangeMessage}
          placeholder='메세지' />
      </Main>
      <Bottom>
        <ErrorSpan>{error}</ErrorSpan>
        <Buttons>
          <TextButton
            type='button'
            onClick={() => {
              setError('');
              onSubmit(message);
            }}>
              전송
          </TextButton>
        </Buttons>
      </Bottom>
    </>
  );
};

export default JoinRequestSenderMain;

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

const Bottom = styled.div`
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