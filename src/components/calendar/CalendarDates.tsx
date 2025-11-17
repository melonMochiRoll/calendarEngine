import React, { FC } from 'react';
import styled from '@emotion/styled';
import DateCover from 'Components/calendar/DateCover';
import { useAppDispatch } from 'Hooks/reduxHooks';
import { setTodoTime } from 'Features/todoTimeSlice';
import { TTodoMap } from 'Src/typings/types';

interface CalendarDatesProps {
  todosData: TTodoMap;
  calendarYear: string;
  calendarMonth: string;
  dates: number[][];
  nowDate: string;
  isNowYearAndMonth: boolean;
};

const CalendarDates: FC<CalendarDatesProps> = ({
  todosData,
  calendarYear,
  calendarMonth,
  dates,
  nowDate,
  isNowYearAndMonth,
}) => {
  const dispatch = useAppDispatch();

  return (
    <Tbody>
      {dates.map((week: number[], weekIndex: number) => 
        <tr key={`week-${weekIndex}`}>
          {
            week.map((date, dateIndex) => {
              const timeKey = `${calendarYear}-${calendarMonth}-${String(date).padStart(2, '0')}`;

              return date ?
                <DateCover
                  key={`date-${dateIndex}`}
                  index={dateIndex}
                  setTodoTime={() => dispatch(setTodoTime(timeKey))}
                  todosLength={todosData[timeKey]?.length || 0}
                  date={date}
                  nowDate={nowDate}
                  isNowYearAndMonth={isNowYearAndMonth} />
                :
                <td key={`date-${dateIndex}`} />;
            })
          }
        </tr>
      )}
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