import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const ErrorPriority = {
  NETWORK_ERROR: 1,
  SERVER_5XX: 2,
  SERVER_401: 3,
  SERVER_403: 4,
  SERVER_404: 5,
  SERVER_4XX: 6,
  UNKNOWN_ERROR: 99,
};

export type TErrorState = {
  code: string;
  priority: number;
  status: number;
  timestamp: string;
  message: string;
  path: string;
  destination: string;
};

const initialState: TErrorState[] = []

export const globalErrorSlice = createSlice({
  name: 'globalError',
  initialState,
  reducers: {
    addError: (state, action: PayloadAction<TErrorState>) => {
      if (state.some((error) => error.code === action.payload.code)) {
        return;
      }

      state.push(action.payload);
      state.sort((a, b) => {
        if (a.priority > b.priority) {
          return 1;
        }

        if (a.priority < b.priority) {
          return -1;
        }
        
        if (a.timestamp < b.timestamp) {
          return 1;
        }

        if (a.timestamp > b.timestamp) {
          return -1;
        }

        return 0;
      });
    },
    clearErrors: (state) => {
      state.splice(0, state.length);
    },
  },
});

export const {
  addError,
  clearErrors,
} = globalErrorSlice.actions;
export default globalErrorSlice.reducer;