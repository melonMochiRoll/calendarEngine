import React, { FC, Suspense } from 'react';
import styled from '@emotion/styled';
import TodoList from 'Components/todo/TodoList';
import TodoHeader from 'Components/todo/TodoHeader';
import { useAppSelector } from 'Src/hooks/reduxHooks';
import { Skeleton } from '@mui/material';
import LoadingCircular from 'Src/components/async/skeleton/LoadingCircular';
import TodoInit from 'Src/components/todo/TodoInit';

interface TodoContainerProps {};

const TodoContainer: FC<TodoContainerProps> = ({}) => {
  const { todoTime } = useAppSelector(state => state.todoTime);
  const [ year, month, date ] = todoTime.split('-');
  
  return (
    <>
      {
        todoTime ?
          <Block>
            <Title>{`${year}년 ${month}월 ${date}일`}</Title>
            <Suspense fallback={<Skeleton sx={{ bgcolor: 'grey.800' }} animation='wave' width={150} height={100} />}>
              <TodoHeader />
            </Suspense>
            <Suspense fallback={<LoadingCircular />}>
              <TodoList />
            </Suspense>
          </Block>
          :
          <TodoInit />
      }
    </>
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

const Title = styled.h1`
  font-size: 46px;
  font-weight: 800;
  color: var(--white);
  margin-top: 0px;
  margin-bottom: 10px;
`;