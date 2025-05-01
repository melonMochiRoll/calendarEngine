import React, { FC } from 'react';
import styled from '@emotion/styled';

const TodoNull: FC = () => {
  return (
    <Block>
      <Span>새 Todo를 작성해보세요!</Span>
    </Block>
  );
};

export default TodoNull;

const Block = styled.div`
  display: flex;
  width: 100%;
  height: 75%;
  padding: 30px 10px;
  margin-bottom: 30px;
  flex-direction: column;
  background-color: var(--black);
  overflow: auto;
`;

const Span = styled.span`
  margin-top: 150px;
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  color: #9298a1;
`;