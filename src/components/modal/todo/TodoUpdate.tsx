import React, { FC, useState } from 'react';
import styled from '@emotion/styled';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { useAppDispatch } from 'Hooks/reduxHooks';
import CloseIcon from '@mui/icons-material/CloseRounded';
import { clearModal, closeModal } from 'Features/modalSlice';
import { useQueryClient } from '@tanstack/react-query';
import { TODO_MAX_SIZE } from 'Constants/calendar';
import { getByteSize } from 'Lib/utilFunction';
import { checkContent, defaultToastOption, successMessage, waitingMessage } from 'Constants/notices';
import { GET_TODOS_KEY, GET_TODOS_LIST_KEY } from 'Constants/queryKeys';
import TextButton from 'Components/common/TextButton';
import { updateTodo } from 'Api/todosApi';
import { toast } from 'react-toastify';
import { TTodo } from 'Typings/types';

export interface TodoUpdateProps {
  todo: TTodo;
  url: string;
  UserId: number;
};

const TodoUpdate: FC<TodoUpdateProps> = ({
  todo,
  url,
  UserId,
}) => {
  dayjs.extend(utc);
  dayjs.extend(timezone);
  dayjs.extend(customParseFormat);
  dayjs.extend(isSameOrAfter);
  const timeZone = dayjs.tz.guess();
  const qc = useQueryClient();
  const dispatch = useAppDispatch();

  const [ start_hour, start_minute ] = todo?.startTime.split(':') || [ '', '00' ];
  const [ end_hour, end_minute ] = todo?.endTime.split(':') || [ '', '00' ];

  const [ startTime, setStartTime ] = useState({ hour: start_hour, minute: start_minute });
  const [ endTime, setEndTime ] = useState({ hour: end_hour, minute: end_minute });
  const [ description, setDescription ] = useState(todo?.description);
  const [ error, setError ] = useState({
    isError: false,
    message: '',
  });

  const onChangeStartTime = (e: any) => {
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

  const onChangeEndTime = (e: any) => {
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

  const onChangeDescriptionWithMaxSize = (e: any) => {
    if (getByteSize(e.target.value) > TODO_MAX_SIZE) {
      return;
    }

    setDescription(e.target.value);
  };

  const onSubmit = (
    todoId: number,
    newDescription: string,
    start: typeof startTime,
    end: typeof endTime,
    UserId: number,
    url: string,
  ) => {
    setError({
      isError: false,
      message: '',
    });

    if (
      newDescription === todo?.description &&
      start === startTime &&
      end === endTime
    ) {
      dispatch(closeModal());
      return;
    }

    const trimmedStartTime = Object.values(start).map((value) => value.trim());
    const trimmedEndTime = Object.values(end).map((value) => value.trim());
    const trimmedDescription = newDescription.trim();

    if (
      trimmedStartTime.includes('') ||
      trimmedEndTime.includes('') ||
      !trimmedDescription
    ) {
      return setError({
        isError: true,
        message: checkContent,
      });
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
      return setError({
        isError: true,
        message: checkContent,
      });
    }

    updateTodo(
      todoId,
      newDescription,
      startTimeFormat,
      endTimeFormat,
      UserId,
      url,
    )
    .then(async () => {
      setStartTime({
        hour: trimmedStartTime[0].padStart(2, '0'),
        minute: trimmedStartTime[1].padStart(2, '0'),
      });
      setEndTime({
        hour: trimmedEndTime[0].padStart(2, '0'),
        minute: trimmedEndTime[1].padStart(2, '0'),
      });
      setDescription(description);
      await qc.refetchQueries([GET_TODOS_KEY]);
      await qc.refetchQueries([GET_TODOS_LIST_KEY]);
      dispatch(clearModal());
      toast.success(successMessage, {
        ...defaultToastOption,
      });
    })
    .catch(() => {
      setError({
        isError: true,
        message: waitingMessage,
      });
    });
  };

  return (
    <Block
      onClick={e => e.stopPropagation()}>
      <Header>
        <Left></Left>
        <Center>
          <ModalTitle>Todo 수정</ModalTitle>
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
            {error.isError && <ErrorSpan>{error.message}</ErrorSpan>}
          </Center>
          <Right>
            <TextButton
              type='button'
              onClick={() => {
                onSubmit(
                  todo?.id as number,
                  description as string,
                  startTime,
                  endTime,
                  UserId,
                  url,
                );
              }}>
              수정
            </TextButton>
          </Right>
        </SubmitDiv>
      </Main>
    </Block>
  );
};

export default TodoUpdate;

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