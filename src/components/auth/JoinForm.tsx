import React, { FC } from 'react';
import styled from '@emotion/styled';
import LabelInput from 'Components/common/LabelInput';
import SubmitButton from 'Components/common/SubmitButton';
import LongSubmitButton, { ButtonIconName } from 'Components/common/LongSubmitButton';
import { useNavigate } from 'react-router-dom';
import { PATHS } from 'Constants/paths';

type ErrorType = {
  email: string,
  password: string,
  passwordChk: string, 
};

interface JoinFormProps {
  email: string;
  password: string;
  passwordChk: string;
  errors: ErrorType;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onChangeEmail: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangePassword: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangePasswordChk: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const JoinForm: FC<JoinFormProps> = ({
  email,
  password,
  passwordChk,
  errors,
  onSubmit,
  onChangeEmail,
  onChangePassword,
  onChangePasswordChk,
}) => {
  const navigate = useNavigate();
  
  return (
    <Form onSubmit={onSubmit}>
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