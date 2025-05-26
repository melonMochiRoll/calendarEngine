import React, { FC, useCallback, useState } from 'react';
import styled from '@emotion/styled';
import useInput from 'Hooks/utils/useInput';
import { createUser, isUser } from 'Api/usersApi';
import { useNavigate } from 'react-router-dom';
import JoinForm from 'Components/auth/JoinForm';

const emailConfirmation = async (email: string) => {
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

  if (await isUser(email)) {
    result.error = '중복 된 이메일입니다.';
    return result;
  }

  return result;
};

const passwordConfirmation = (
  password: string,
) => {
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

const passwordChkConfirmation = (
  password: string,
  passwordChk: string,
) => {
  if (password !== passwordChk.trim()) {
    return '비밀번호가 일치하지 않습니다.';
  }

  return '';
};

interface JoinContainerProps {};

const JoinContainer: FC<JoinContainerProps> = ({}) => {
  const navigate = useNavigate();
  const [ email, onChangeEmail ] = useInput('');
  const [ password, onChangePassword ] = useInput('');
  const [ passwordChk, onChangePasswordChk ] = useInput('');
  const [ errors, setErrors ] = useState({
    email: '',
    password: '',
    passwordChk: '',
  });

  const onSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({
      email: '',
      password: '',
      passwordChk: '',
    });

    const emailConfirmResult = await emailConfirmation(email);
    const passwordConfirmResult = passwordConfirmation(password);
    const passwordChkError = passwordChkConfirmation(passwordConfirmResult.password, passwordChk);

    if (
      emailConfirmResult.error ||
      passwordConfirmResult.error ||
      passwordChkError
      ) {
      setErrors({
        email: emailConfirmResult.error,
        password: passwordConfirmResult.error,
        passwordChk: passwordChkError,
      });
    }

    createUser(emailConfirmResult.email, passwordConfirmResult.password)
      .then(() => {
        navigate('/');
      })
      .catch(() => {
        setErrors({
          email: '잠시 후 다시 시도해 주세요',
          password: '',
          passwordChk: '',
        });
      });
    
  }, [email, password, passwordChk]);

  return (
    <Main>
      <JoinForm
        email={email}
        password={password}
        passwordChk={passwordChk}
        errors={errors}
        onSubmit={onSubmit}
        onChangeEmail={onChangeEmail}
        onChangePassword={onChangePassword}
        onChangePasswordChk={onChangePasswordChk} />
    </Main>
  );
};

export default JoinContainer;

const Main = styled.main`
  display: flex;
  height: 100vh;
  justify-content: center;
  background-color: var(--black);
`;