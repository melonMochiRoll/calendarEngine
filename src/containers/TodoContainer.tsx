import React, { FC, Suspense } from 'react';
import styled from '@emotion/styled';
import TodoList from 'Components/todo/TodoList';
import TodoHeader from 'Components/todo/TodoHeader';
import { useAppSelector } from 'Src/hooks/reduxHooks';
import LoadingCircular from 'Src/components/async/skeleton/LoadingCircular';
import TodoInit from 'Src/components/todo/TodoInit';
import { ErrorBoundary } from 'react-error-boundary';
import TodoFallback from 'Src/components/async/fallbackUI/TodoFallback';

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
            <ErrorBoundary fallbackRender={(props) => <TodoFallback errorProps={props} />}>
              <Suspense fallback={<LoadingCircular />}>
                <TodoHeader />
                <TodoList />
              </Suspense>
            </ErrorBoundary>
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