import { configureStore } from "@reduxjs/toolkit";
import modalReducer from 'Features/modalSlice';
import calendarTimeReducer from 'Features/calendarTimeSlice';
import todoTimeReducer from 'Features/todoTimeSlice';
import todoDetailReducer from "Features/todoDetailSlice";
import joinRequestDetailReducer from 'Features/joinRequestDetailSlice';
import imageViewerReducer from 'Features/imageViewerSlice';

export const reduxStore = configureStore({
  reducer: {
    modal: modalReducer,
    calendarTime: calendarTimeReducer,
    todoTime: todoTimeReducer,
    todoDetail: todoDetailReducer,
    joinRequestDetail: joinRequestDetailReducer,
    imageViewer: imageViewerReducer,
  },
})

export type RootState = ReturnType<typeof reduxStore.getState>;
export type AppDispatch = typeof reduxStore.dispatch;