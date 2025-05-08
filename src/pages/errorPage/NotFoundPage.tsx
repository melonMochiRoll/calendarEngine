import React, { FC } from 'react';
import styled from '@emotion/styled';
import MenuButton from 'Components/common/MenuButton';
import { useNavigate } from 'react-router-dom';

const NotFoundPage: FC = () => {
  const navigate = useNavigate();

  return (
    <Block>
      <Box>
        <h1>404</h1>
        <span>페이지를 찾을수 없습니다.</span>
        <MenuButton
          type={'button'}
          onClick={() => navigate('/')}>
            홈으로
        </MenuButton>
      </Box>
    </Block>
  );
};

export default NotFoundPage;

const Block = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  background-color: #1f2128;
`;

const Box = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 300px;
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