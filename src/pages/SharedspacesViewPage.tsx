import React, { FC } from 'react';
import styled from '@emotion/styled';
import CalendarContainer from 'Containers/CalendarContainer';
import CalendarHeader from 'Components/calendar/CalendarHeader';
import AsyncBoundary from 'Components/AsyncBoundary';
import LoadingCircular from 'Components/skeleton/LoadingCircular';
import GenericErrorFallback from 'Components/errors/GenericErrorFallback';

const SharedspacesViewPage: FC = () => {
  return (
    <Block>
      <CalendarHeader />
      <AsyncBoundary
        errorBoundaryFallback={GenericErrorFallback}
        suspenseFallback={<LoadingCircular />}>
        <CalendarContainer />
      </AsyncBoundary>
    </Block>
  );
};

export default SharedspacesViewPage;

const Block = styled.div`
  display: flex;
  flex-direction: column;
  width: 70%;
  height: 100%;
  padding: 20px 80px;
  background-color: var(--black);
`;