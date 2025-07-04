import React, { FC, useState } from 'react';
import styled from '@emotion/styled';
import { getCsrfToken, login, loginOAuth2Google, loginOAuth2Naver } from 'Api/authApi';
import LoginForm from 'Components/auth/LoginForm';
import { useQueryClient } from '@tanstack/react-query';
import { GET_USER_KEY } from 'Constants/queryKeys';
import { useNavigate } from 'react-router-dom';
import { PATHS } from 'Constants/paths';
import { useLoginValidator } from 'Hooks/utils/useLoginValidator';
import { incorrectCredentialsMessage, waitingMessage } from 'Constants/notices';
import { useAppDispatch } from 'Src/hooks/reduxHooks';
import { setCsrfToken } from 'Src/features/csrfTokenSlice';

interface LoginContainerProps {};

const LoginContainer: FC<LoginContainerProps> = ({}) => {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { emailConfirmation, passwordConfirmation } = useLoginValidator();
  const [ errors, setErrors ] = useState({
    email: '',
    password: '',
  });

  const onGoogleLogin = () => {
    loginOAuth2Google()
      .then((res) => {
        window.open(res, '_self');
      });
  };

  const onNaverLogin = () => {
    loginOAuth2Naver()
      .then((res) => {
        window.open(res, '_self');
      });
  };

  const onSubmit = (email: string, password: string) => {
    setErrors({
      email: '',
      password: '',
    });

    const emailConfirm = emailConfirmation(email);
    const passwordConfirm = passwordConfirmation(password);

    if (emailConfirm || passwordConfirm) {
      setErrors({
        email: emailConfirm,
        password: passwordConfirm,
      });
      return;
    }

    login(email, password)
      .then(async (user) => {
        qc.setQueryData([GET_USER_KEY], user);

        const token = await getCsrfToken();
        dispatch(setCsrfToken({ token }));
        
        navigate(PATHS.SHAREDSPACE);
      })
      .catch((error) => {
        const errorMessage = error?.response?.status === 401 ?
          incorrectCredentialsMessage :
          waitingMessage

        setErrors({
          email: errorMessage,
          password: '',
        })
      });
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