import React, { FC } from 'react';
import styled from '@emotion/styled';
import DaysOfWeekHeader from 'Components/calendar/DaysOfWeekHeader';
import CalendarDates from 'Components/calendar/CalendarDates';
import { useAppSelector } from 'Hooks/reduxHooks';
import { useTodosByMonth } from 'Src/hooks/queries/useTodosByMonth';

interface CalendarContainerProps {};

const CalendarContainer: FC<CalendarContainerProps> = () => {
  const { data: todosData } = useTodosByMonth();
  const {
    calendarYear,
    calendarMonth,
    dates,
    nowDay,
    nowDate,
    isNowYearAndMonth
  } = useAppSelector(state => state.calendarTime);
  
  return (
    <Table>
      <DaysOfWeekHeader
        isNowYearAndMonth={isNowYearAndMonth}
        nowDay={nowDay} />
      <CalendarDates
        todosData={todosData}
        calendarYear={calendarYear}
        calendarMonth={calendarMonth}
        dates={dates}
        nowDate={nowDate}
        isNowYearAndMonth={isNowYearAndMonth} />
    </Table>
  );
};

export default CalendarContainer;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  td {
    user-select: none;
  }
`;