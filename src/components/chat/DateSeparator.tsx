import React, { FC } from 'react';
import styled from '@emotion/styled';

interface DateSeparatorProps {
  date: string,
}

const DateSeparator: FC<DateSeparatorProps> = ({ date }) => {
  return (
    <Block>
      <Rapper>
        <Top></Top>
        <Bottom></Bottom>
      </Rapper>
      <Timestamp>{date}</Timestamp>
      <Rapper>
        <Top></Top>
        <Bottom></Bottom>
      </Rapper>
    </Block>
  );
};

export default DateSeparator;

const Block = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 0 20px;
  gap: 5px;
`;

const Rapper = styled.div`
  flex-grow: 1;
`;

const Top = styled.div`
  width: 100%;
  height: 50%;
  border-bottom: 1px solid var(--gray-7);
`;

const Bottom = styled.div`
  width: 100%;
  height: 50%;
`;

const Timestamp = styled.span`
  color: var(--gray-5);
  font-size: 14px;
`;