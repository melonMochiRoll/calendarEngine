import React, { FC, useEffect } from 'react';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import useUser from 'Hooks/useUser';
import JoinContainer from 'Containers/JoinContainer';

const JoinPage: FC = () => {
  const navigate = useNavigate();
  const { data: userData, isLogin } = useUser({ suspense: false, throwOnError: false });

  useEffect(() => {
    if (isLogin) {
      navigate('/');
    }
  }, [userData]);
  
  return (
    <Block>
      <JoinContainer />
    </Block>
  );
};

export default JoinPage;

const Block = styled.div`
  display: flex;
  height: 100vh;
  justify-content: center;
  background-color: #1f2128;
`;