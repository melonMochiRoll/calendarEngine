import React, { FC } from 'react';
import styled from '@emotion/styled';
import { TODO_PALETTE } from 'Constants/calendar';

interface DateCoverProps {
  setTodoTime: () => void;
  index: number;
  todosLength: number;
  date: number;
  nowDate: string;
  isNowYearAndMonth: boolean;
};

const DateCover: FC<DateCoverProps> = ({
  setTodoTime,
  index,
  todosLength,
  date,
  nowDate,
  isNowYearAndMonth,
}) => {
  return (
    <Block
      isToday={isNowYearAndMonth && (date === Number(nowDate))}
      onClick={setTodoTime}>
      <Content>
        <Top>
          <span>{date}</span>
        </Top>
        <Bottom>
          {todosLength ? <Count i={index}>{todosLength}</Count> : ''}
        </Bottom>
      </Content>
    </Block>
  );
};

export default DateCover;

const Block = styled.td<{ isToday: boolean }>`
  width: 120px;
  cursor: pointer;
  border: ${({isToday}) => isToday ?
    `2px solid var(--pink)` : `1px solid var(--light-gray)`};
  box-shadow: ${({isToday}) => isToday && 'inset 0 0 7px var(--pink)'};

  &:hover {
    background-color: #2c2f38;
  }

  svg {
    color: var(--pink);
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 100%;
`;

const Top = styled.div`
  width: 100%;
  height: 50%;
`;

const Bottom = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  width: 100%;
  height: 50%;
  padding: 5px;
`;

const Count = styled.div<{ i: number }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 28px;
  height: 28px;
  padding: 0 1px 0 0;
  border-radius: 25px;
  color: var(--white);
  font-size: 18px;
  background-color: ${({i}) => TODO_PALETTE[i % 7]};
`;