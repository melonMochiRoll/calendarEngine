import React, { FC } from 'react';
import styled from '@emotion/styled';
import LabelInput from 'Components/common/LabelInput';
import SubmitButton from 'Components/common/SubmitButton';
import LongSubmitButton, { ButtonIconName } from 'Components/common/LongSubmitButton';
import { useNavigate } from 'react-router-dom';
import { PATHS } from 'Constants/paths';
import useInput from 'Hooks/utils/useInput';

interface JoinFormProps {
  onSubmit: (email: string, password: string, passwordChk: string) => void;
  errors: {
    email: string,
    password: string,
    passwordChk: string
  };
};

const JoinForm: FC<JoinFormProps> = ({
  onSubmit,
  errors,
}) => {
  const navigate = useNavigate();
  const [ email, onChangeEmail ] = useInput('');
  const [ password, onChangePassword ] = useInput('');
  const [ passwordChk, onChangePasswordChk ] = useInput('');

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    email: string,
    password: string,
    passwordChk: string,
  ) => {
    e.preventDefault();
    onSubmit(email.trim(), password.trim(), passwordChk.trim());
  };
  
  return (
    <Form onSubmit={(e) => handleSubmit(e, email, password, passwordChk)}>
      <Title>회원가입</Title>
      <LabelInput
        id='email'
        name='email'
        value={email}
        onChangeValue={onChangeEmail}
        title='이메일'
        type='text' />
      {errors.email ? <ErrorSpan>{errors.email}</ErrorSpan> : <ErrorSpan />}
      <LabelInput
        id='password'
        name='password'
        value={password}
        onChangeValue={onChangePassword}
        title='비밀번호'
        type='password' />
      {errors.password ? <ErrorSpan>{errors.password}</ErrorSpan> : <ErrorSpan />}
      <LabelInput
        id='passwordChk'
        name='passwordChk'
        value={passwordChk}
        onChangeValue={onChangePasswordChk}
        title='비밀번호 확인'
        type='password' />
      {errors.passwordChk ? <ErrorSpan>{errors.passwordChk}</ErrorSpan> : <ErrorSpan />}
      <ButtonBox>
        <LongSubmitButton
          type='submit'
          icon={ButtonIconName.JOIN}>
            회원가입
        </LongSubmitButton>
        <SubmitButton
          onClick={() => navigate(PATHS.LOGIN)}
          type='button'>
            뒤로
        </SubmitButton>
      </ButtonBox>
    </Form>
  );
};

export default JoinForm;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 50px 25px;
  margin-bottom: 300px;
  gap: 7px;
`;

const Title = styled.h1`
  color: #fff;
  font-size: 42px;
`;

const ButtonBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  gap: 15px;
`;

export const ErrorSpan = styled.span`
  color: #e66641;
  font-size: 14px;
`;