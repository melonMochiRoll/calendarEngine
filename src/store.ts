import { configureStore } from "@reduxjs/toolkit";
import modalReducer from 'Features/modalSlice';
import calendarTimeReducer from 'Features/calendarTimeSlice';
import todoTimeReducer from 'Features/todoTimeSlice';
import searchUsersReducer from 'Features/searchUsersSlice';
import subscribedspaceFilterReducer from 'Features/subscribedspacesFilterSlice';
import todoDetailReducer from "Features/todoDetailSlice";
import joinRequestDetailReducer from 'Features/joinRequestDetailSlice';
import searchTodosReducer from 'Features/searchTodosSlice';
import imageViewerReducer from 'Features/imageViewerSlice';

export const reduxStore = configureStore({
  reducer: {
    modal: modalReducer,
    calendarTime: calendarTimeReducer,
    todoTime: todoTimeReducer,
    searchUsers: searchUsersReducer,
    subscribedspaceFilter: subscribedspaceFilterReducer,
    todoDetail: todoDetailReducer,
    joinRequestDetail: joinRequestDetailReducer,
    searchTodos: searchTodosReducer,
    imageViewer: imageViewerReducer,
  },
})

export type RootState = ReturnType<typeof reduxStore.getState>;
export type AppDispatch = typeof reduxStore.dispatch;