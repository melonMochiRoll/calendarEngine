import React, { FC } from 'react';
import styled from '@emotion/styled';
import SearchIcon from '@mui/icons-material/Search';
import ArrowRightIcon from '@mui/icons-material/ArrowForwardRounded';
import ArrowLeftIcon from '@mui/icons-material/ArrowBackRounded';
import { nextMonth, prevMonth } from 'Features/calendarTimeSlice';
import { useAppDispatch, useAppSelector } from 'Hooks/reduxHooks';
import { openModal } from 'Features/modalSlice';
import { ModalName } from 'Typings/types';

const CalendarHeader: FC = () => {
  const dispatch = useAppDispatch();
  const { calendarYear, calendarMonth } = useAppSelector(state => state.calendarTime);

  return (
    <Header>
      <CalendarTitle>
        <Title>
          {calendarYear}년 {calendarMonth}월
        </Title>
      </CalendarTitle>
      <Searchbar
        onClick={() => dispatch(openModal(ModalName.SEARCH))}>
        <SearchIcon sx={SearchIconInlineStyle}/>
        <span>Search...</span>
      </Searchbar>
      <ControlPanel>
        <ArrowLeftIcon
          sx={ArrowIconInlineStyle}
          onClick={() => dispatch(prevMonth())} />
        <ArrowRightIcon
          sx={ArrowIconInlineStyle}
          onClick={() => dispatch(nextMonth())} />
      </ControlPanel>
    </Header>
  );
};

export default CalendarHeader;

const Header = styled.header`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
`;

const CalendarTitle = styled.div`
  display: flex;
`;

const Title = styled.h1`
  font-size: 48px;
  text-align: center;
  font-weight: 800;
  color: var(--white);
  padding: 3px;
  margin: 0;
`;

const Searchbar = styled.div`
  display: flex;
  align-items: center;
  background-color: var(--light-gray);
  width: 185px;
  border: 1px solid var(--light-gray);
  border-radius: 15px;
  padding: 8px 10px;
  gap: 10px;
  cursor: pointer;
  transition: all 0.1s linear;

  &:hover {
    border-color: var(--blue);
  }

  span {
    color: var(--white);
  }

  svg {
    cursor: pointer;
  }
`;

const SearchIconInlineStyle = {
  color: 'var(--blue)',
};

const ControlPanel = styled.div`
  display: flex;
  align-items: end;
  padding: 5px 10px;
  gap: 10px;

  svg {
    cursor: pointer;
    border-radius: 8px;
    color: var(--white);
  }

  svg:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const ArrowIconInlineStyle = {
  fontSize: '40px',
};