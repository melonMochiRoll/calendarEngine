import React, { FC } from 'react';
import styled from '@emotion/styled';
import TodoList from 'Components/todo/TodoList';
import TodoHeader from 'Components/todo/TodoHeader';
import { useTodos } from 'Hooks/queries/useTodos';
import TodoNull from 'Components/todo/TodoNull';
import { useSharedspace } from 'Src/hooks/queries/useSharedspace';

interface TodoContainerProps {};

const TodoContainer: FC<TodoContainerProps> = ({}) => {
  const { data: todosData } = useTodos();
  const { data: spaceData } = useSharedspace();
  const { permission } = spaceData;
  
  return (
    <Block>
      <TodoHeader hasMemberPermission={permission.isMember} />
      {todosData.length ? <TodoList todosData={todosData} /> : <TodoNull />}
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