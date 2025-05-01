import React, { FC } from 'react';
import styled from '@emotion/styled';
import CalendarContainer from 'Containers/CalendarContainer';
import CalendarHeader from 'Components/calendar/CalendarHeader';
import AsyncBoundary from 'Components/AsyncBoundary';
import { GET_TODOS_LIST_KEY } from 'Lib/queryKeys';
import LoadingCircular from 'Components/skeleton/LoadingCircular';
import GenericErrorFallback from 'Components/errors/GenericErrorFallback';
import { useQueryClient } from '@tanstack/react-query';

const SharedspacesViewPage: FC = () => {
  const qc = useQueryClient();

  return (
    <Calendar>
      <CalendarHeader />
      <AsyncBoundary
        errorBoundaryFallback={GenericErrorFallback}
        suspenseFallback={<LoadingCircular />}
        onReset={() => {
          qc.removeQueries([GET_TODOS_LIST_KEY]);
        }}>
        <CalendarContainer />
      </AsyncBoundary>
    </Calendar>
  );
};

export default SharedspacesViewPage;

const Calendar = styled.div`
  display: flex;
  flex-direction: column;
  width: 70%;
  height: 100%;
  padding: 20px 80px;
  background-color: var(--black);
`;