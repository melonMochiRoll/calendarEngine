import React, { FC } from 'react';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import Header from 'Layouts/Header';
import MenuButton from 'Components/common/MenuButton';

const ForbiddenPage: FC = () => {
  const navigate = useNavigate();
  
  return (
    <Block>
      <Header />
      <Box>
        <h1>403</h1>
        <span>해당 요청에 필요한 권한이 부족합니다. 권한을 요청하거나 계정을 확인해주세요.</span>
        <MenuButton
          type={'button'}
          onClick={() => navigate('/')}>
            홈으로
        </MenuButton>
      </Box>
    </Block>
  );
};

export default ForbiddenPage;

const Block = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background-color: #1f2128;
`;

const Box = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 500px;
  margin-top: 100px;
  gap: 20px;
  
  h1 {
    font-size: 120px;
    color: #fff;
    margin: 0;
  }

  span {
    font-size: 20px;
    font-weight: 300;
    color: #fff;
  }
`;