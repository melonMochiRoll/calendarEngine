import React, { FC, useState } from 'react';
import styled from '@emotion/styled';
import { TODO_MAX_SIZE } from 'Constants/calendar';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import CloseIcon from '@mui/icons-material/CloseRounded';
import { useAppDispatch, useAppSelector } from 'Hooks/reduxHooks';
import { closeModal } from 'Features/modalSlice';
import TextButton from 'Components/common/TextButton';
import { useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import useUser from 'Hooks/queries/useUser';
import { createTodo } from 'Api/todosApi';
import { GET_TODOS_KEY, GET_TODOS_LIST_KEY } from 'Constants/queryKeys';
import { checkContent, defaultToastOption, successMessage, waitingMessage } from 'Constants/notices';
import { getByteSize } from 'Lib/utilFunction';
import { toast } from 'react-toastify';

const TodoInput: FC = () => {
  dayjs.extend(utc);
  dayjs.extend(timezone);
  dayjs.extend(customParseFormat);
  dayjs.extend(isSameOrAfter);

  const timeZone = dayjs.tz.guess();
  const qc = useQueryClient();
  const dispatch = useAppDispatch();

  const { url } = useParams();
  const { data: userData } = useUser();
  const { todoTime } = useAppSelector(state => state.todoTime);
  const { calendarYear, calendarMonth } = useAppSelector(state => state.calendarTime);

  const initialTime = { hour: '', minute: '00' };
  const [ startTime, setStartTime ] = useState(initialTime);
  const [ endTime, setEndTime ] = useState(initialTime);
  const [ description, setDescription ] = useState('');
  const [ errorMessage, setErrorMessage ] = useState('');

  const onChangeStartTime = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 2) return;

    if (e.target.name === 'hour') {
      setStartTime((prev) => {
        return { ...prev, hour: Number(e.target.value) > 23 ? '23' : `${e.target.value}` };
      });
    }

    if (e.target.name === 'minute') {
      setStartTime((prev) => {
        return { ...prev, minute: Number(e.target.value) > 59 ? '59' : `${e.target.value}` };
      });
    }
  };

  const onChangeEndTime = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 2) return;

    if (e.target.name === 'hour') {
      setEndTime((prev) => {
        return { ...prev, hour: Number(e.target.value) > 23 ? '23' : `${e.target.value}` };
      });
    }

    if (e.target.name === 'minute') {
      setEndTime((prev) => {
        return { ...prev, minute: Number(e.target.value) > 59 ? '59' : `${e.target.value}` };
      });
    }
  };

  const onChangeDescriptionWithMaxSize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (getByteSize(e.target.value) > TODO_MAX_SIZE) {
      return;
    }

    setDescription(e.target.value);
  };

  const onSubmit = (
    description: string,
    todoTime: string,
    start: typeof startTime,
    end: typeof endTime,
    UserId: number | undefined,
    url: string | undefined,
  ) => {
    setErrorMessage('');

    const trimmedStartTime = Object.values(start).map((value) => value.trim());
    const trimmedEndTime = Object.values(end).map((value) => value.trim());
    const trimmedDescription = description.trim();

    if (
      trimmedStartTime.includes('') ||
      trimmedEndTime.includes('') ||
      !trimmedDescription
    ) {
      setErrorMessage(checkContent);
      return;
    }

    const startTimeFormat = `${trimmedStartTime[0].padStart(2, '0')}:${trimmedStartTime[1].padEnd(2, '0')}:00`;
    const endTimeFormat = `${trimmedEndTime[0].padStart(2, '0')}:${trimmedEndTime[1].padEnd(2, '0')}:00`;
    const dayjs_startTime = dayjs(startTimeFormat, 'HH:mm:ss').tz(timeZone);
    const dayjs_endTime = dayjs(endTimeFormat === '00:00:00' ? '24:00:00' : endTimeFormat, 'HH:mm:ss').tz(timeZone);

    if (
      !dayjs_startTime.isValid() ||
      !dayjs_endTime.isValid() ||
      dayjs(dayjs_startTime).isSameOrAfter(dayjs_endTime)
    ) {
      setErrorMessage(checkContent);
      return;
    }

    createTodo(
      description,
      todoTime,
      startTimeFormat,
      endTimeFormat,
      UserId,
      url,
    )
    .then(async () => {
      await qc.refetchQueries([GET_TODOS_KEY, url, todoTime]);
      await qc.refetchQueries([GET_TODOS_LIST_KEY, url, calendarYear, calendarMonth]);
      toast.success(successMessage, {
        ...defaultToastOption,
      });
      dispatch(closeModal());
    })
    .catch(() => {
      setErrorMessage(waitingMessage);
    });
  };

  return (
    <Block onClick={e => e.stopPropagation()}>
      <Header>
        <Left></Left>
        <Center>
          <ModalTitle>Todo 작성</ModalTitle>
        </Center>
        <Right>
          <CloseIcon
            onClick={() => dispatch(closeModal())}
            sx={CloseIconInlineStyle} />
        </Right>
      </Header>
      <Main>
        <TimeDiv>
          <TimeBox>
            <span>시작 시간</span>
            <TimeInput
              value={startTime.hour}
              onChange={onChangeStartTime}
              name='hour'
              type='text'
              maxLength={2}
              placeholder='00' />
            <span>:</span>
            <TimeInput
              value={startTime.minute}
              onChange={onChangeStartTime}
              name='minute'
              type='text'
              maxLength={2}
              placeholder='00' />
          </TimeBox>
          <TimeBox>
            <span>종료 시간</span>
            <TimeInput
              value={endTime.hour}
              onChange={onChangeEndTime}
              name='hour'
              type='text'
              maxLength={2}
              placeholder='00' />
            <span>:</span>
            <TimeInput
              value={endTime.minute}
              onChange={onChangeEndTime}
              name='minute'
              type='text'
              maxLength={2}
              placeholder='00' />
          </TimeBox>
        </TimeDiv>
        <DescriptionDiv>
          <DescriptionInput
            value={description}
            onChange={onChangeDescriptionWithMaxSize}
            placeholder='내용' />
        </DescriptionDiv>
        <SubmitDiv>
          <Left></Left>
          <Center>
            {errorMessage && <ErrorSpan>{errorMessage}</ErrorSpan>}
          </Center>
          <Right>
            <TextButton
              type='button'
              onClick={() => {
                onSubmit(
                  description,
                  todoTime,
                  startTime,
                  endTime,
                  userData?.id,
                  url,
                );
              }}>
              공유
            </TextButton>
          </Right>
        </SubmitDiv>
      </Main>
    </Block>
  );
};

export default TodoInput;

const Block = styled.div`
  display: flex;
  flex-direction: column;
  width: 450px;
  height: 300px;
  border-radius: 15px;
  background-color: var(--black);
  box-shadow: 1px 1px 10px 2px #000;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 20%;
  padding: 20px 0;
  border-bottom: 1px solid var(--light-gray);
`;

const Left = styled.div`
  width: 15%;
`;

const Center = styled.div`
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

const Right = styled.div`
  display: flex;
  justify-content: center;
  width: 15%;
`;

const Main = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 80%;
  color: var(--white);
`;

const TimeDiv = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 20%;
  border-bottom: 1px solid var(--gray-8);

  span {
    font-size: 18px;
    font-weight: 600;
  }
`;

const TimeBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50%;
  gap: 5px;
`;

const TimeInput = styled.input`
  width: 40px;
  font-size: 22px;
  font-weight: 500;
  text-align: center;
  color: var(--white);
  font-weight: 600;
  background-color: rgba(0, 0, 0, 0);
  border: none;

  &::placeholder {
    font-weight: 600;
    color: var(--light-gray);
  }

  &:focus {
    outline: none;
  }
`;

const DescriptionDiv = styled.div`
  width: 100%;
  height: 60%;
  padding: 20px;
  border-bottom: 1px solid var(--gray-8);
`;

const DescriptionInput = styled.textarea`
  width: 100%;
  height: 100%;
  font-size: 18px;
  font-weight: 500;
  color: var(--white);
  border: none;
  background-color: var(--black);
  resize: none;

  &::placeholder {
    font-weight: 600;
    color: var(--gray.8);
  }

  &:focus {
    outline: none;
  }
`;

const SubmitDiv = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 20%;
`;

const ErrorSpan = styled.span`
  font-size: 16px;
  color: var(--red);
`;

const CloseIconInlineStyle = {
  color: 'var(--white)',
  fontSize: '35px',
  cursor: 'pointer',
};