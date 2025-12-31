import React, { FC } from 'react';
import styled from '@emotion/styled';
import ErrorIcon from '@mui/icons-material/ErrorOutline';
import { useAppDispatch } from 'Hooks/reduxHooks';
import { closeModal } from 'Features/modalSlice';
import { setCalendarTime } from 'Features/calendarTimeSlice';
import { setTodoTime } from 'Features/todoTimeSlice';
import { TSearchTodosPayload } from 'Typings/types';

interface SearchResultProps {
  query: string,
  todosData: TSearchTodosPayload,
  nextPage: () => void,
}; 

const SearchResult: FC<SearchResultProps> = ({
  query,
  todosData,
  nextPage,
}) => {
  const dispatch = useAppDispatch();
  const { items, hasMoreData } = todosData;

  const onClickTodo = (date: string) => {
    dispatch(setCalendarTime(date));
    dispatch(setTodoTime(date));
    dispatch(closeModal());
  };

  return (
    <Block>
      {items.length ?
        <TodoList>
          {
            items.map((todo) => {
              return (
                <TodoItem
                  key={todo.id}
                  onClick={() => onClickTodo(todo.date)}>
                  <Date>{todo.date}</Date>
                  <Description>{todo.description}</Description>
                </TodoItem>
              );
            })
          }
          {hasMoreData &&
            <LoadMore onClick={nextPage}>
              Load More
            </LoadMore>
          }
        </TodoList> :
        <>
          <ErrorIcon sx={ErrorInlineStyle} />
          <NotFoundMessage>{`"${query}" 에 대한 검색 결과가 없습니다.`}</NotFoundMessage>
        </>
      }
    </Block>
  );
};

export default SearchResult;

const Block = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 85%;
`;

const TodoList = styled.ul`
  width: 100%;
  height: 100%;
  padding: 10px;
  margin: 0;
  text-align: center;
  list-style: none;
  overflow: auto;
`;

const TodoItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 20px;
  margin-bottom: 10px;
  color: var(--white);
  border: 1px solid var(--light-gray);
  border-radius: 15px;
  cursor: pointer;
  user-select: none;
  gap: 10px;
  transition: all 0.1s linear;

  &:hover {
    border-color: var(--white);
  }
`;

const Date = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: #0d47a1;
  width: 20%;
  font-size: 14px;
  font-weight: 600;
  border-radius: 25px;
  padding: 8px 15px;
  background-color: #d2f7ff;
`;

const ErrorInlineStyle = {
  color: 'var(--white)',
  fontSize: '64px',
  paddingBottom: '15px',
};

const Description = styled.span`
  width: 80%;
  color: var(--white);
  font-size: 20px;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const NotFoundMessage = styled.span`
  color: var(--white);
  font-size: 20px;
  font-weight: 600;
`;

const LoadMore = styled.button`
  font-size: 24px;
  font-weight: 600;
  padding: 10px 15px;
  margin: 20px 0;
  color: var(--white);
  border: 1px solid var(--light-gray);
  border-radius: 5px;
  background-color: var(--black);
  cursor: pointer;
  transition: all 0.1s linear;

  &:hover {
    background-color: var(--red);
    border-color: var(--red);
  }
`;