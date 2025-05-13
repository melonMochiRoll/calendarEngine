import React, { FC } from 'react';
import styled from '@emotion/styled';
import { DAYS } from 'Constants/calendar';

interface DaysOfWeekHeaderProps {
  isNowYearAndMonth: boolean;
  nowDay: number;
};

const DaysOfWeekHeader: FC<DaysOfWeekHeaderProps> = ({
  isNowYearAndMonth,
  nowDay,
}) => {
  return (
    <Thead>
      <tr>
        {DAYS.map((ele: string, i: number) =>
          <Day key={i + ele} isToday={isNowYearAndMonth && (i === nowDay)}>{ele}</Day>
        )}
      </tr>
    </Thead>
  );
};

export default DaysOfWeekHeader;

const Thead = styled.thead`
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  color: var(--white);

  tr {
    border-spacing: 5px;
  }
`;

const Day = styled.td<{ isToday: boolean }>`
  border: 1px solid var(--light-gray);
  background-color: ${({isToday}) => isToday ? 'var(--purple)' : 'var(--dark-gray)'};
  padding: 7px 0;
`;