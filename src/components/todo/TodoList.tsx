import React, { FC, Fragment } from 'react';
import styled from '@emotion/styled';
import { TTodoPayload } from 'Typings/types';
import TodoItem from './TodoItem';
import { TODO_PALETTE } from 'Constants/calendar';
import { getTodoHeight, renderTime, timeToDayjs } from 'Lib/utilFunction';
import TodoBlank from './TodoBlank';

interface TodoListProps {
  todoData: TTodoPayload[],
};

const TodoList: FC<TodoListProps> = ({
  todoData,
}) => {
  return (
    <Block>
      <ListHeader>
        <TimeDiv>
          <TimeSpan>{renderTime(todoData[0]?.startTime)}</TimeSpan>
        </TimeDiv>
      </ListHeader>
      <ListBody>
        {
          todoData.map((todo: TTodoPayload, idx: number) => {
            const height = getTodoHeight(todo.startTime, todo.endTime);

            if (todoData.length === idx + 1) {
              return (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  todoHeight={height}
                  bgColor={TODO_PALETTE[idx % 7]} />
              );
            }

            const nextTodo = todoData[idx + 1];

            if (timeToDayjs(todo.endTime) < timeToDayjs(nextTodo.startTime)) {
              return (
                <Fragment key={todo.id}>
                  <TodoItem
                    todo={todo}
                    todoHeight={height}
                    bgColor={TODO_PALETTE[idx % 7]} />
                  <TodoBlank
                    blankHeight={getTodoHeight(todo.endTime, nextTodo.startTime)}
                    nextTodoStartTime={nextTodo.startTime}
                    borderBottomColor={TODO_PALETTE[(idx + 1) % 7]} />
                </Fragment>
              );
            }

            return (
              <TodoItem
                key={todo.id}
                todo={todo}
                todoHeight={height}
                bgColor={TODO_PALETTE[idx % 7]}
                hideEndTime={timeToDayjs(todo.endTime) > timeToDayjs(nextTodo.startTime)} />
            );
          })
        }
      </ListBody>
    </Block>
  );
};

export default TodoList;

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

const ListHeader = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  color: var(--white);
  font-size: 22px;
  font-weigth: 600;
  margin: 0;
  border-bottom: 1px solid var(--white);
`;

const TimeDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  width: 15%;
  height: 30px;
`;

const TimeSpan = styled.span`
  color: var(--white);
  font-size: 22px;
  font-weight: 500;
`;

const ListBody = styled.div`
  display: flex;
  flex-direction: column;
`;