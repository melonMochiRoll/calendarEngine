import React, { FC, useState } from 'react';
import styled from '@emotion/styled';
import { createUser } from 'Api/usersApi';
import { useNavigate } from 'react-router-dom';
import JoinForm from 'Components/auth/JoinForm';
import { defaultToastOption, successJoin, waitingMessage } from 'Constants/notices';
import { PATHS } from 'Constants/paths';
import { useJoinValidator } from 'Hooks/utils/useJoinValidator';
import { toast } from 'react-toastify';

interface JoinContainerProps {};

const JoinContainer: FC<JoinContainerProps> = ({}) => {
  const navigate = useNavigate();
  const { emailConfirmation, passwordConfirmation, passwordChkConfirmation } = useJoinValidator();
  const [ errors, setErrors ] = useState({
    email: '',
    password: '',
    passwordChk: '',
  });

  const onSubmit = async (email: string, password: string, passwordChk: string) => {
    setErrors({
      email: '',
      password: '',
      passwordChk: '',
    });

    const emailConfirm = await emailConfirmation(email);
    const passwordConfirm = passwordConfirmation(password);
    const passwordChkConfirm = passwordChkConfirmation(password, passwordChk);

    if (
      emailConfirm ||
      passwordConfirm ||
      passwordChkConfirm
      ) {
      setErrors({
        email: emailConfirm,
        password: passwordConfirm,
        passwordChk: passwordChkConfirm,
      });
      return;
    }

    try {
      await createUser(email, password);
      toast.success(successJoin, {
        ...defaultToastOption,
      });
      navigate(PATHS.LOGIN);
    } catch (err) {
      setErrors({
        email: waitingMessage,
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