import React, { FC } from 'react';
import styled from '@emotion/styled';
import DateCover from 'Components/calendar/DateCover';
import useTodosList from 'Hooks/useTodosList';
import { useAppDispatch, useAppSelector } from 'Hooks/reduxHooks';
import { setTodoTime } from 'Features/todoTimeSlice';
import { DAYS } from 'Lib/calendarConstants';

interface CalendarContainerProps {};

const CalendarContainer: FC<CalendarContainerProps> = () => {
  const dispatch = useAppDispatch();
  const { data: todosListData } = useTodosList({ suspense: true, throwOnError: true });

  const {
    calendarYear,
    calendarMonth,
    nowDay,
    dates,
    isNowYearAndMonth,
  } = useAppSelector(state => state.calendarTime);
  
  return (
    <Block>
      <WeekBlock>
        <tr>
          {DAYS.map((ele: string, i: number) =>
            <Day key={i + ele} isToday={isNowYearAndMonth && (i === nowDay)}>{ele}</Day>
          )}
        </tr>
      </WeekBlock>
      <DayBlock>
        {dates.map((d: number|string, i: number) => {
          if (i % 7 === 0) {
            return (
              <tr key={i}>
                {[1, 2, 3, 4, 5, 6, 7].map((n, idx) => {
                  const date = dates[i + n];
                  const isBlank = !date || typeof date === 'string';
                  const timeKey = `${calendarYear}-${calendarMonth}-${String(date).padStart(2, '0')}`;

                  return isBlank ?
                    <td key={i + n} /> :
                    <DateCover
                      key={i + n}
                      index={idx}
                      setTodoTime={() => dispatch(setTodoTime(timeKey))}
                      todosLength={todosListData[timeKey] || 0}
                      date={date} />;
                })}
              </tr>
            )
          }
        })}
      </DayBlock>
    </Block>
  );
};

export default CalendarContainer;

const Block = styled.table`
  width: 100%;
  border-collapse: collapse;

  td {
    user-select: none;
  }
`;

const WeekBlock = styled.thead`
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  color: var(--white);

  tr {
    border-spacing: 5px;
  }
`;

const DayBlock = styled.tbody`

  td {
    font-size: 20px;
    padding: 5px;
    vertical-align: top;
    height: 115px;
    color: var(--white);
    background-color: var(--dark-gray);
  }

  td:first-of-type {
    color: #e66641;
  }

  td:last-of-type {
    color: #2576f0;
  }
`;

const Day = styled.td<{ isToday: boolean }>`
  border: 1px solid var(--light-gray);
  background-color: ${({isToday}) => isToday ? 'var(--purple)' : 'var(--dark-gray)'};
  padding: 7px 0;
`;