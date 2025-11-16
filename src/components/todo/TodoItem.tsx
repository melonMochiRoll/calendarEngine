import React, { FC, useState } from 'react';
import styled from '@emotion/styled';
import { ModalName, TTodo } from 'Typings/types';
import { useAppDispatch } from 'Hooks/reduxHooks';
import { openModal } from 'Features/modalSlice';
import { renderTime } from 'Lib/utilFunction';
import { TODO_MAX_HEIGHT } from 'Constants/calendar';
import ClockIcon from '@mui/icons-material/AccessTime';
import DescriptionIcon from '@mui/icons-material/Description';
import PencilIcon from '@mui/icons-material/Create';

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
  const [ hover, setHover ] = useState({ visible: false, x: 0, y: 0 });

  const openTodoDetail = (todo: TTodo) => {
    dispatch(openModal({
      name: ModalName.TODO_DETAIL,
      props: { todo },
    }));
  };

  return (
    <Article todoHeight={todoHeight > TODO_MAX_HEIGHT ? TODO_MAX_HEIGHT : todoHeight}>
      <Left>
        {!hideEndTime &&
          <TimeDiv borderBottomColor={bgColor}>
            <TimeSpan>{renderTime(endTime)}</TimeSpan>
          </TimeDiv>}
      </Left>
      <Right
        onMouseEnter={(e) => setHover({ visible: true, x: e.clientX, y: e.clientY })}
        onMouseLeave={() => setHover({ visible: false, x: 0, y: 0 })}>
        <DescriptionDiv
          onClick={() => openTodoDetail(todo)}
          bgColor={bgColor}
          borderBottomColor={bgColor}>
          <DescriptionSpan>{description}</DescriptionSpan>
        </DescriptionDiv>
      </Right>
      {
        hover.visible &&
        <HoverDiv
          x={hover.x}
          y={hover.y}>
            <FlexDiv>
              <ClockIcon fontSize='small' />
              <span>{`${renderTime(todo.startTime)} ~ ${renderTime(todo.endTime)}`}</span>
            </FlexDiv>
            <FlexDiv>
              <DescriptionIcon fontSize='small' />
              <span>{todo.description}</span>
            </FlexDiv>
            <FlexDiv>
              <PencilIcon fontSize='small' />
              <span>{`${todo.Author.email}`}</span>
            </FlexDiv>
        </HoverDiv>
      }
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

const HoverDiv = styled.div<{ x: number, y: number }>`
  position: absolute;
  display: flex;
  flex-direction: column;
  left: ${({x}) => x - 200}px;
  top: ${({y}) => y + 15}px;
  padding: 10px 15px;
  color: var(--white);
  border: 1px solid var(--gray-7);
  border-radius: 15px;
  background-color: var(--dark-gray);
  gap: 5px;
  z-index: 1;
`;

const FlexDiv = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;