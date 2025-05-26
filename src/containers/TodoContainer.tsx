import React, { FC } from 'react';
import styled from '@emotion/styled';
import TodoList from 'Components/todo/TodoList';
import TodoHeader from 'Components/todo/TodoHeader';
import useTodos from 'Hooks/queries/useTodos';
import useUser from 'Hooks/queries/useUser';
import TodoNull from 'Components/todo/TodoNull';
import { useParams } from 'react-router-dom';

interface TodoAppProps {};

const TodoContainer: FC<TodoAppProps> = ({}) => {
  const { url } = useParams();
  const { hasMemberPermission } = useUser();
  const { data: todosData } = useTodos({ suspense: true, throwOnError: true });
  
  return (
    <Block>
      <TodoHeader hasMemberPermission={() => hasMemberPermission(url)} />
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