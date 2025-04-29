import React, { FC } from 'react';
import styled from '@emotion/styled';
import MenuButton from 'Components/common/MenuButton';
import { useNavigate } from 'react-router-dom';
import Header from 'Containers/Header';

const InternalServerErrorPage: FC = () => {
  const navigate = useNavigate();

  return (
    <Block>
      <Header />
      <Box>
        <h1>500</h1>
        <span>서버에 오류가 발생했습니다. 잠시 후 다시 시도해주세요.</span>
        <MenuButton
          type={'button'}
          onClick={() => navigate('/')}>
            홈으로
        </MenuButton>
      </Box>
    </Block>
  );
};

export default InternalServerErrorPage;

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