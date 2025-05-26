import React, { FC } from 'react';
import styled from '@emotion/styled';
import { useTodosList } from 'Hooks/queries/useTodosList';
import DaysOfWeekHeader from 'Components/calendar/DaysOfWeekHeader';
import CalendarDates from 'Components/calendar/CalendarDates';
import { useAppSelector } from 'Hooks/reduxHooks';

interface CalendarContainerProps {};

const CalendarContainer: FC<CalendarContainerProps> = () => {
  const { data: todosListData } = useTodosList();
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
        todosListData={todosListData}
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