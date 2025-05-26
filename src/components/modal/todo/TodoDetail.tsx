import React, { FC } from 'react';
import styled from '@emotion/styled';
import { useAppDispatch, useAppSelector } from 'Hooks/reduxHooks';
import { closeModal, openModal } from 'Features/modalSlice';
import CloseIcon from '@mui/icons-material/CloseRounded';
import ClockIcon from '@mui/icons-material/AccessTime';
import DescriptionIcon from '@mui/icons-material/Description';
import PencilIcon from '@mui/icons-material/Create';
import MenuIcon from '@mui/icons-material/MoreHoriz';
import useMenu from 'Hooks/utils/useMenu';
import { Menu, MenuItem } from '@mui/material';
import { deleteTodo } from 'Api/todosApi';
import { useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { GET_TODOS_KEY, GET_TODOS_LIST_KEY } from 'Constants/queryKeys';
import useUser from 'Hooks/queries/useUser';
import { toast } from 'react-toastify';
import { defaultToastOption, successMessage } from 'Constants/notices';
import { formatDateTime } from 'Lib/utilFunction';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { ModalName, TTodo } from 'Typings/types';

export interface TodoDetailProps {
  todo: TTodo;
};

const TodoDetail: FC<TodoDetailProps> = ({ todo }) => {
  const qc = useQueryClient();
  const dispatch = useAppDispatch();
  dayjs.extend(utc);
  dayjs.extend(timezone);
  const localTimeZone = dayjs.tz.guess();

  const {
    calendarYear,
    calendarMonth,
  } = useAppSelector(state => state.calendarTime);

  const { url } = useParams();
  const { data: userData, hasMemberPermission } = useUser({ suspense: false, throwOnError: false });

  const {
    anchorEl,
    open,
    onOpen,
    onClose,
  } = useMenu();

  const onClickTodoDelete = async (todoId: number, url: string | undefined) => {
    if (!url) {
      return;
    }

    await deleteTodo(todoId, url);
    dispatch(closeModal());
    await qc.refetchQueries([GET_TODOS_KEY, url, calendarYear, calendarMonth]);
    await qc.refetchQueries([GET_TODOS_LIST_KEY]);
    toast.success(successMessage, {
      ...defaultToastOption,
    });
  };

  const openTodoUpdate = (todo: TTodo, url: string | undefined, UserId: number | undefined) => {
    if (!UserId || !url) {
      return;
    }

    dispatch(openModal({
      name: ModalName.TODO_UPDATE,
      props: { todo, url, UserId }
    }));
  };
  
  return (
    <Block onClick={e => e.stopPropagation()}>
      <Header>
        <MenuWrapper>
          {hasMemberPermission(url) &&
            <MenuIcon
              onClick={onOpen}
              fontSize='large'
              sx={{ color: 'var(--white)', cursor: 'pointer' }} />
          }
          <Menu
            aria-labelledby='demo-positioned-button'
            anchorEl={anchorEl}
            open={open}
            onClick={onClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            transformOrigin={{ vertical: 'top', horizontal: 'center' }}>
              <MenuItem
                onClick={() => openTodoUpdate(todo, url, userData?.id)}>
                <span>수정</span>
              </MenuItem>
              <MenuItem
                onClick={() => onClickTodoDelete(todo.id, url)}>
                <span>삭제</span>
              </MenuItem>
            </Menu>
        </MenuWrapper>
        <TitleWrapper>
          <ModalTitle>Todo</ModalTitle>
        </TitleWrapper>
        <CloseButtonWrapper>
          <CloseIcon
            onClick={() => dispatch(closeModal())}
            sx={CloseIconInlineStyle} />
        </CloseButtonWrapper>
      </Header>
      <ContentsWrapper>
        <Contents>
          <Content>
            <ClockIcon sx={{ color: 'var(--blue)' }}/>
            <ContentSpan>{`${todo?.startTime} ~ ${todo?.endTime}`}</ContentSpan>
          </Content>
          <Content>
            <DescriptionIcon />
            <ContentSpan>{todo?.description}</ContentSpan>
          </Content>
          <Content>
            <PencilIcon />
            <ContentSpan>{`${todo?.Author.email}, ${formatDateTime(dayjs(todo?.createdAt).tz(localTimeZone).format())}`}</ContentSpan>
          </Content>
        </Contents>
        <UpdatedAtWrapper>
          {todo?.Editor && <LastupdatedAt>{`Last UpdatedAt : ${todo?.Editor.email}, ${formatDateTime(dayjs(todo?.updatedAt).tz(localTimeZone).format())}`}</LastupdatedAt>}
        </UpdatedAtWrapper>
      </ContentsWrapper>
    </Block>
  );
};

export default TodoDetail;

const Block = styled.div`
  display: flex;
  flex-direction: column;
  width: 450px;
  border-radius: 15px;
  background-color: var(--black);
  box-shadow: 1px 1px 10px 2px #000;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 60px;
  padding: 20px 0;
  border-bottom: 1px solid var(--light-gray);
`;

const MenuWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 15%;
`;

const TitleWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 70%;
`;

const ModalTitle = styled.h1`
  color: var(--white);
  font-size: 24px;
  font-weight 600;
  margin: 0;
`;

const CloseButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 15%;
`;

const ContentsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  padding: 20px;
  color: var(--white);
  gap: 50px;
`;

const Contents = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 70%;
  gap: 10px;
`;

const UpdatedAtWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 30%;
  gap: 10px;
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  gap: 10px;
`;

const ContentSpan = styled.span`
  width: 100%;
  font-size: 22px;
  word-wrap: break-all;
  word-break: break-all;
`;

const LastupdatedAt = styled.span`
  color: #868e96;
  font-size: 16px;
`;

const CloseIconInlineStyle = {
  color: 'var(--white)',
  fontSize: '35px',
  cursor: 'pointer',
};