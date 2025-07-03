import { configureStore } from "@reduxjs/toolkit";
import modalReducer from 'Features/modalSlice';
import calendarTimeReducer from 'Features/calendarTimeSlice';
import todoTimeReducer from 'Features/todoTimeSlice';
import globalErrorReducer from 'Features/globalErrorSlice';
import csrfTokenReducer from 'Features/csrfTokenSlice';

export const reduxStore = configureStore({
  reducer: {
    modal: modalReducer,
    calendarTime: calendarTimeReducer,
    todoTime: todoTimeReducer,
    globalError: globalErrorReducer,
    csrfToken: csrfTokenReducer,
  },
});

export type RootState = ReturnType<typeof reduxStore.getState>;
export type AppDispatch = typeof reduxStore.dispatch;

export const getCsrfTokenFromStore = () => {
  const state = reduxStore.getState();

  return state.csrfToken.token;
};