import React, { FC, useState } from 'react';
import styled from '@emotion/styled';
import { getCsrfToken, login, loginOAuth2Google, loginOAuth2Naver } from 'Api/authApi';
import LoginForm from 'Components/auth/LoginForm';
import { useQueryClient } from '@tanstack/react-query';
import { GET_USER_KEY } from 'Constants/queryKeys';
import { useNavigate } from 'react-router-dom';
import { PATHS } from 'Constants/paths';
import { waitingMessage } from 'Constants/notices';
import { useAppDispatch } from 'Src/hooks/reduxHooks';
import { setCsrfToken } from 'Src/features/csrfTokenSlice';
import { AxiosError } from 'axios';

interface LoginContainerProps {};

const LoginContainer: FC<LoginContainerProps> = ({}) => {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [ errors, setErrors ] = useState({
    email: '',
    password: '',
  });

  const onGoogleLogin = async () => {
    const url = await loginOAuth2Google();
    window.open(url, '_self');
  };

  const onNaverLogin = async () => {
    const url = await loginOAuth2Naver();
    window.open(url, '_self');
  };

  const onSubmit = async (email: string, password: string) => {
    setErrors({
      email: '',
      password: '',
    });
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const emailConfirm = !emailPattern.test(email) ? '이메일 형식을 확인해주세요' : '';;
    const passwordConfirm = password.length < 8 ? '비밀번호는 8자 이상이어야 합니다.' : '';

    if (emailConfirm || passwordConfirm) {
      setErrors({
        email: emailConfirm,
        password: passwordConfirm,
      });
      return;
    }

    try {
      const userData = await login(email, password);
      qc.setQueryData([GET_USER_KEY], userData);

      const token = await getCsrfToken();
      dispatch(setCsrfToken({ token }));
      
      navigate(PATHS.SHAREDSPACE);
    } catch (err) {
      setErrors({
        email: err instanceof AxiosError ? err?.response?.data.message : waitingMessage,
        password: '',
      });
    }
  };
  
  return (
    <Main>
      <LoginForm
        onSubmit={onSubmit}
        onGoogleLogin={onGoogleLogin}
        onNaverLogin={onNaverLogin}
        errors={errors} />
    </Main>
  );
};

export default LoginContainer;

const Main = styled.main`
  display: flex;
  height: 100vh;
  justify-content: center;
  background-color: var(--black);
`;