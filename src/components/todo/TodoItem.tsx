import React, { FC } from 'react';
import styled from '@emotion/styled';
import { ModalName, TTodo } from 'Typings/types';
import { useAppDispatch } from 'Hooks/reduxHooks';
import { openModal } from 'Features/modalSlice';
import { setTodoDetail } from 'Features/todoDetailSlice';
import { renderTime } from 'Lib/utilFunction';
import { TODO_MAX_HEIGHT } from 'Lib/calendarConstants';

interface TodoItemProps {
  todo: TTodo;
  todoHeight: number;
  bgColor: string;
  hideEndTime?: boolean;
};

const TodoItem: FC<TodoItemProps> = ({
  todo,
  todoHeight,
  bgColor,
  hideEndTime = false,
}) => {
  const dispatch = useAppDispatch();
  const { description, endTime } = todo;

  const onClickDescription = () => {
    dispatch(setTodoDetail(todo));
    dispatch(openModal(ModalName.TODO_DETAIL));
  };

  return (
    <Article
      todoHeight={todoHeight > TODO_MAX_HEIGHT ? TODO_MAX_HEIGHT : todoHeight}>
      <Left>
        {!hideEndTime &&
          <TimeDiv borderBottomColor={bgColor}>
            <TimeSpan>{renderTime(endTime)}</TimeSpan>
          </TimeDiv>}
      </Left>
      <Right>
        <DescriptionDiv
          onClick={() => onClickDescription()}
          bgColor={bgColor}
          borderBottomColor={bgColor}>
          <DescriptionSpan>{description}</DescriptionSpan>
        </DescriptionDiv>
      </Right>
    </Article>
  );
};

export default TodoItem;

const Article = styled.article<{ todoHeight: number }>`
  display: flex;
  width: 100%;
  height: ${({ todoHeight }) => todoHeight}px;
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

const TimeDiv = styled.div<{ borderBottomColor: string }>`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  height: 100%;
  border-bottom: 1px solid ${({ borderBottomColor }) => borderBottomColor};
`;

const TimeSpan = styled.span`
  color: var(--white);
  font-size: 20px;
  font-weight: 500;
`;

const DescriptionDiv = styled.div<{ bgColor: string, borderBottomColor: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 0 10px;
  background-color: ${({ bgColor }) => bgColor ? bgColor : ''};
  border-bottom: 1px solid ${({ borderBottomColor }) => borderBottomColor};
  cursor: pointer;
`;

const DescriptionSpan = styled.span`
  color: var(--white);
  font-size: 22px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;