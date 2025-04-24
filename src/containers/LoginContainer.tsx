import React, { FC, useCallback, useState } from 'react';
import useInput from 'Hooks/useInput';
import { login } from 'Api/authApi';
import { useNavigate } from 'react-router-dom';
import LoginForm from 'Components/auth/LoginForm';
import { PATHS } from 'Constants/paths';

const emailConfirmation = (email: string) => {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const result = {
    email: email.trim(),
    error: '',
  };

  if (!email) {
    result.error = '이메일을 입력해주세요';
    return result;
  }

  if (!emailPattern.test(email)) {
    result.error = '이메일 형식을 확인해주세요';
    return result;
  }

  return result;
};

const passwordConfirmation = (password: string) => {
  const result = {
    password: password.trim(),
    error: '',
  };

  if (!password) {
    result.error = '비밀번호를 입력해주세요';
    return result;
  }

  if (password.length < 8) {
    result.error = '비밀번호는 8자 이상이어야 합니다.';
    return result;
  }

  return result;
};

interface LoginContainerProps {};

const LoginContainer: FC<LoginContainerProps> = ({}) => {
  const navigate = useNavigate();
  const [ email, onChangeEmail ] = useInput('');
  const [ password, onChangePassword ] = useInput('');
  const [ errors, setErrors ] = useState({
    email: '',
    password: '',
  });

  const onSubmit = useCallback((e: any) => {
    e.preventDefault();
    setErrors({
      email: '',
      password: '',
    });

    const emailConfirmResult = emailConfirmation(email);
    const passwordConfirmResult = passwordConfirmation(password);

    if (emailConfirmResult.error || passwordConfirmResult.error) {
      setErrors({
        email: emailConfirmResult.error,
        password: passwordConfirmResult.error,
      });
      return;
    }
  
    login(emailConfirmResult.email, passwordConfirmResult.password)
      .then(() => {
        navigate(PATHS.SHAREDSPACE);
      })
      .catch((errorMessage) => {
        setErrors({
          email: errorMessage,
          password: '',
        });
      });

  }, [email, password]);
  
  return (
    <LoginForm
      email={email}
      password={password}
      errors={errors}
      onSubmit={onSubmit}
      onChangeEmail={onChangeEmail}
      onChangePassword={onChangePassword} />
  );
};

export default LoginContainer;