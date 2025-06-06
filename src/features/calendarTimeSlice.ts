import { range, pipe, flat, toArray, chunk, fx } from "@fxts/core";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import dayjs, { Dayjs } from "dayjs";

const now = dayjs();

const getDates = (now: Dayjs) => {
  const firstDay = now.date(1).day();
  const lastDate = now.daysInMonth();
  const lastDay = now.date(lastDate).day();

  return pipe(
    flat([
      fx(range(1, firstDay + 1)).map(() => 0),
      range(1, lastDate + 1),
      fx(range(1, 6 - lastDay + 1)).map(() => 0),
    ]),
    chunk(7),
    toArray
  );
};

const initialState = {
  calendarYear: String(now.year()),
  calendarMonth: String(now.month() + 1).padStart(2, '0'),
  nowYear: String(now.year()),
  nowMonth: String(now.month() + 1).padStart(2, '0'),
  nowDate: String(now.date()).padStart(2, '0'),
  nowDay: now.day(),
  dates: getDates(now),
  isNowYearAndMonth: true,
};

export const calendarTimeSlice = createSlice({
  name: 'calendarTime',
  initialState,
  reducers: {
    setCalendarTime: (state, actions: PayloadAction<string>) => {
      const currentTime = dayjs(actions.payload);
      const strYear = String(currentTime.year());
      const strMonth = String(currentTime.month() + 1).padStart(2, '0');

      state.calendarYear = strYear;
      state.calendarMonth = strMonth;
      state.isNowYearAndMonth = (strYear === state.nowYear) && (strMonth === state.nowMonth);
      state.dates = getDates(currentTime);
    },
    prevMonth: (state) => {
      const prevTime = dayjs(`${state.calendarYear}-${state.calendarMonth}`).month(Number(state.calendarMonth) - 2);
      const strYear = String(prevTime.year());
      const strMonth = String(prevTime.month() + 1).padStart(2, '0');

      state.calendarYear = strYear;
      state.calendarMonth = strMonth;
      state.isNowYearAndMonth = (strYear === state.nowYear) && (strMonth === state.nowMonth);
      state.dates = getDates(prevTime);
    },
    nextMonth: (state) => {
      const nextTime = dayjs(`${state.calendarYear}-${state.calendarMonth}`).month(Number(state.calendarMonth));
      const strYear = String(nextTime.year());
      const strMonth = String(nextTime.month() + 1).padStart(2, '0');

      state.calendarYear = strYear;
      state.calendarMonth = strMonth;
      state.isNowYearAndMonth = (strYear === state.nowYear) && (strMonth === state.nowMonth);
      state.dates = getDates(nextTime);
    },
  },
});

export const {
  setCalendarTime,
  prevMonth,
  nextMonth,
} = calendarTimeSlice.actions;
export default calendarTimeSlice.reducer;