import React, { FC } from 'react';
import styled from '@emotion/styled';
import LabelInput from 'Components/common/LabelInput';
import SubmitButton from 'Components/common/SubmitButton';
import { ErrorSpan } from './JoinForm';
import LongSubmitButton, { ButtonIconName } from 'Components/common/LongSubmitButton';
import TextButton from 'Components/common/TextButton';
import { PATHS } from 'Constants/paths';
import useInput from 'Hooks/utils/useInput';
import { useNavigate } from 'react-router-dom';

interface LoginFormProps {
  onSubmit: (email: string, password: string) => void;
  onGoogleLogin: () => void;
  onNaverLogin: () => void;
  errors: {
    email: string,
    password: string,
  };
};

const LoginForm: FC<LoginFormProps> = ({
  onSubmit,
  onGoogleLogin,
  onNaverLogin,
  errors,
}) => {
  const navigate = useNavigate();
  const [ email, onChangeEmail ] = useInput('');
  const [ password, onChangePassword ] = useInput('');

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement>,
    email: string,
    password: string,
  ) => {
    e.preventDefault();
    onSubmit(email.trim(), password.trim());
  };

  return (
    <Form onSubmit={(e) => handleSubmit(e, email, password)}>
      <Title>로그인</Title>
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
      <ButtonBox>
        <JoinBox>
          <span>계정이 없으신가요?</span>
          <TextButton
            type='button'
            onClick={() => navigate(PATHS.JOIN)}>
            회원가입
          </TextButton>
        </JoinBox>
        <LongSubmitButton
          type='submit'
          icon={ButtonIconName.LOGIN}>
            로그인
        </LongSubmitButton>
        <LongSubmitButton
          onClick={onGoogleLogin}
          type='button'
          hexCode='var(--google-blue)'
          icon={ButtonIconName.GOOGLE}>
          구글 로그인
        </LongSubmitButton>
        <LongSubmitButton
          onClick={onNaverLogin}
          type='button'
          hexCode='var(--naver-green)'
          icon={ButtonIconName.NAVER}>
          네이버 로그인
        </LongSubmitButton>
        <SubmitButton
          onClick={() => navigate(-1)}
          type='button'>
            뒤로
        </SubmitButton>
      </ButtonBox>
    </Form>
  );
};

export default LoginForm;

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
  gap: 15px;
`;

const JoinBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--white);
  font-size: 14px;
`;