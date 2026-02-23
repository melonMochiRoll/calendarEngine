import React, { FC } from 'react';
import styled from '@emotion/styled';
import { useAppDispatch } from 'Hooks/reduxHooks';
import AddIcon from '@mui/icons-material/AddCircleOutlineRounded';
import { openModal } from 'Features/modalSlice';
import { ModalName } from 'Typings/types';
import { useSharedspace } from 'Src/hooks/queries/useSharedspace';

interface TodoHeaderProps {};

const TodoHeader: FC<TodoHeaderProps> = ({}) => {
  const dispatch = useAppDispatch();
  const { data: spaceData } = useSharedspace();
  const { permission } = spaceData;

  return (
    <>
      {
        permission.isMember ?
          <FlexBox
            onClick={() => dispatch(openModal({ name: ModalName.TODO_INPUT }))}>
            <AddIcon fontSize='large' sx={{ color: 'var(--blue)' }}/>
            <Span>새 Todo 작성</Span>
          </FlexBox> :
          <DisableFlexBox />
      }
    </>
  );
};

export default TodoHeader;

const FlexBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 175px;
  height: 100px;
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

const DisableFlexBox = styled.div`
  width: 175px;
  height: 100px;
`;