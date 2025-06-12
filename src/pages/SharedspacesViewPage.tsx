import React, { FC } from 'react';
import styled from '@emotion/styled';
import CalendarContainer from 'Containers/CalendarContainer';
import CalendarHeader from 'Components/calendar/CalendarHeader';
import AsyncBoundary from 'Components/AsyncBoundary';
import LoadingCircular from 'Components/skeleton/LoadingCircular';
import GlobalErrorFallback from 'Components/errors/GlobalErrorFallback';

const SharedspacesViewPage: FC = () => {
  return (
    <Background>
      <CalendarHeader />
      <AsyncBoundary
        errorBoundaryFallback={GlobalErrorFallback}
        suspenseFallback={<LoadingCircular />}>
        <CalendarContainer />
      </AsyncBoundary>
    </Background>
  );
};

export default SharedspacesViewPage;

const Background = styled.div`
  display: flex;
  flex-direction: column;
  width: 70%;
  height: 100%;
  padding: 20px 80px;
  background-color: var(--black);
`;