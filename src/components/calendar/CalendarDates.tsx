import React, { FC } from 'react';
import styled from '@emotion/styled';
import DateCover from 'Components/calendar/DateCover';
import { useAppDispatch } from 'Hooks/reduxHooks';
import { setTodoTime } from 'Features/todoTimeSlice';
import { TTodosList } from 'Hooks/queries/useTodosList';

interface CalendarDatesProps {
  todosListData: TTodosList;
  calendarYear: string;
  calendarMonth: string;
  dates: Array<string | number>;
  nowDate: string;
  isNowYearAndMonth: boolean;
};

const CalendarDates: FC<CalendarDatesProps> = ({
  todosListData,
  calendarYear,
  calendarMonth,
  dates,
  nowDate,
  isNowYearAndMonth,
}) => {
  const dispatch = useAppDispatch();

  return (
    <Tbody>
      {dates.map((date: number|string, i: number) => {
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
                    date={date}
                    nowDate={nowDate}
                    isNowYearAndMonth={isNowYearAndMonth} />;
              })}
            </tr>
          )
        }
      })}
    </Tbody>
  );
};

export default CalendarDates;

const Tbody = styled.tbody`
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