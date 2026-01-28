import React, { FC } from 'react';
import styled from '@emotion/styled';

const ChatDisableFooter: FC = () => {
  return (
    <Footer>
      <Block>
        <Input
          disabled
          placeholder='로그인이 필요합니다.' />
      </Block>
    </Footer>
  );
};

export default ChatDisableFooter;

const Footer = styled.footer`
  padding: 0 20px;
`;

const Block = styled.form`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 60px;
  padding: 15px;
  background-color: var(--light-gray);
  border-radius: 8px;
  gap: 10px;
`;

const Input = styled.input`
  width: 100%;
  color: var(--white);
  font-size: 20px;
  background-color: var(--light-gray);
  border: none;
  outline: none;
`;