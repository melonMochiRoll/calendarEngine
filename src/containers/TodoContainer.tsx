import React, { FC } from 'react';
import styled from '@emotion/styled';
import TodoList from 'Components/todo/TodoList';
import TodoHeader from 'Components/todo/TodoHeader';
import TodoNull from 'Components/todo/TodoNull';
import { useSharedspace } from 'Src/hooks/queries/useSharedspace';
import { useTodosByMonth } from 'Src/hooks/queries/useTodosByMonth';
import { useAppSelector } from 'Src/hooks/reduxHooks';

interface TodoContainerProps {};

const TodoContainer: FC<TodoContainerProps> = ({}) => {
  const { data: todosData } = useTodosByMonth();
  const { data: spaceData } = useSharedspace();
  const { permission } = spaceData;

  const { todoTime } = useAppSelector(state => state.todoTime);
  const todoData = todosData[todoTime];
  
  return (
    <Block>
      <TodoHeader hasMemberPermission={permission.isMember} />
      {todoData?.length ? <TodoList todoData={todoData} /> : <TodoNull />}
    </Block>
  );
};

export default TodoContainer;

const Block = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 0 10px;
`;