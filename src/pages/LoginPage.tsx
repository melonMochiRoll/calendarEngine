import React, { FC, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import styled from '@emotion/styled';
import LoginContainer from 'Containers/LoginContainer';
import { toast } from 'react-toastify';
import { defaultToastOption } from 'Constants/notices';
import WithGuestGuard from 'Components/hoc/WithGuestGuard';

const LoginPage: FC = () => {
  const [ searchParams ] = useSearchParams();

  useEffect(() => {
    if (searchParams.get('error')) {
      toast.error(searchParams.get('error'), {
        ...defaultToastOption
      });
    }
  }, []);

  return (
    <Block>
      <LoginContainer />
    </Block>
  )
};

export default WithGuestGuard(LoginPage);

const Block = styled.div`
  display: flex;
  height: 100vh;
  justify-content: center;
  background-color: #1f2128;
`;