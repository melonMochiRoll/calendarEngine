import React, { FC } from 'react';
import styled from '@emotion/styled';
import { useAppDispatch, useAppSelector } from 'Hooks/reduxHooks';
import AddIcon from '@mui/icons-material/AddCircleOutlineRounded';
import { openModal } from 'Features/modalSlice';
import { ModalName } from 'Typings/types';

interface TodoHeaderProps {
  hasMemberPermission: boolean,
};

const TodoHeader: FC<TodoHeaderProps> = ({
  hasMemberPermission,
}) => {
  const dispatch = useAppDispatch();
  const { todoTime } = useAppSelector(state => state.todoTime);
  const [ year, month, date ] = todoTime.split('-');

  return (
    <>
      <Title>{`${year}년 ${month}월 ${date}일`}</Title>
      <FlexBox visibility={hasMemberPermission}
        onClick={() => dispatch(openModal({ name: ModalName.TODO_INPUT }))}>
        <AddIcon fontSize='large' sx={{ color: 'var(--blue)' }}/>
        <Span>새 Todo 작성</Span>
      </FlexBox>
    </>
  );
};

export default TodoHeader;

const Title = styled.h1`
  font-size: 46px;
  font-weigth: 800;
  color: var(--white);
  margin-top: 0px;
  margin-bottom: 10px;
`;

const FlexBox = styled.div<{ visibility: boolean }>`
  visibility: ${({ visibility }) => visibility ? 'visible' : 'hidden'};
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px 0;
  padding: 10px 20px;
  color: var(--white);
  border: 1px solid var(--gray-7);
  cursor: pointer;
  gap: 6px;

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

const Span = styled.span`
  font-size: 22px;
  font-weight: 700;
`;