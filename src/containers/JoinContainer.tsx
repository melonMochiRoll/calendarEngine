import React, { FC, useState } from 'react';
import styled from '@emotion/styled';
import { createUser, existsByNickname, isUser } from 'Api/usersApi';
import { useNavigate } from 'react-router-dom';
import JoinForm from 'Components/auth/JoinForm';
import { defaultToastOption, successJoin, waitingMessage } from 'Constants/notices';
import { PATHS } from 'Constants/paths';
import { toast } from 'react-toastify';

interface JoinContainerProps {};

const JoinContainer: FC<JoinContainerProps> = ({}) => {
  const navigate = useNavigate();
  const [ errors, setErrors ] = useState({
    email: '',
    nickname: '',
    password: '',
    passwordChk: '',
  });

  const onSubmit = async (
    email: string,
    nickname: string,
    password: string,
    passwordChk: string
  ) => {
    setErrors({
      email: '',
      nickname: '',
      password: '',
      passwordChk: '',
    });

    const emailConfirmation = async (email: string) => {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
      if (!emailPattern.test(email)) {
        return '이메일 형식을 확인해주세요';
      }
  
      if (await isUser(email)) {
        return '중복 된 이메일입니다.';
      }
  
      return '';
    };

    const nicknameConfirmation = async (nickname: string) => {
      const nicknamePattern = /^[a-zA-Z0-9가-힣]+$/;

      if (nickname.length < 2 || nickname.length > 8) {
        return '닉네임은 2자 이상 8자 이하여야 합니다.';
      }

      if (!nicknamePattern.test(nickname)) {
        return '닉네임은 반드시 영문 대소문자, 한글, 숫자로만 이루어져야 합니다.';
      }

      if (await existsByNickname(nickname)) {
        return '중복 된 닉네임입니다.';
      }

      return '';
    };

    const emailConfirm = await emailConfirmation(email);
    const nicknameConfirm = await nicknameConfirmation(nickname);
    const passwordConfirm = password.length < 8 ? '비밀번호는 8자 이상이어야 합니다.' : '';
    const passwordChkConfirm = password !== passwordChk ? '비밀번호가 일치하지 않습니다.' : '';

    if (
      emailConfirm ||
      nicknameConfirm ||
      passwordConfirm ||
      passwordChkConfirm
      ) {
      setErrors({
        email: emailConfirm,
        nickname: nicknameConfirm,
        password: passwordConfirm,
        passwordChk: passwordChkConfirm,
      });
      return;
    }

    try {
      await createUser(email, nickname, password);
      toast.success(successJoin, {
        ...defaultToastOption,
      });
      navigate(PATHS.LOGIN);
    } catch (err) {
      setErrors({
        email: waitingMessage,
        nickname: '',
        password: '',
        passwordChk: '',
      });
    }
  };

  return (
    <Main>
      <JoinForm
        onSubmit={onSubmit}
        errors={errors} />
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