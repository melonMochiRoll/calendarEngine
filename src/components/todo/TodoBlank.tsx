import React, { FC } from 'react';
import styled from '@emotion/styled';
import { renderTime } from 'Lib/utilFunction';

interface TodoBlankProps {
  blankHeight: number;
  nextTodoStartTime: string;
  borderBottomColor: string;
};

const TodoBlank: FC<TodoBlankProps> = ({
  blankHeight,
  nextTodoStartTime,
  borderBottomColor,
}) => {
  return (
    <Article
      blankHeight={blankHeight > 180 ? 180 : blankHeight}
      borderBottomColor={borderBottomColor}>
      <Left>
        <TimeDiv>
          <TimeSpan>{renderTime(nextTodoStartTime)}</TimeSpan>
        </TimeDiv>
      </Left>
      <Right>
        <DescriptionDiv />
      </Right>
    </Article>
  );
};

export default TodoBlank;

const Article = styled.article<{ blankHeight: number, borderBottomColor: string }>`
  display: flex;
  height: ${({ blankHeight }) => blankHeight}px;
  border-bottom: 1px solid ${({ borderBottomColor }) => borderBottomColor};
`;

const Left = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 15%;
  height: 100%;
`;

const Right = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 85%;
  height: 100%;
  background-color: var(--white);
`;

const TimeDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const TimeSpan = styled.span`
  color: var(--white);
  font-size: 20px;
  font-weight: 500;
`;

const DescriptionDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: var(--dark-gray);
`;