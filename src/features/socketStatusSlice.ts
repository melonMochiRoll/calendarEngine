import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SocketStatus } from "Src/constants/constants";
import { TSocketStatus } from "Src/typings/types";

const initialState: { socketStatus: TSocketStatus } = {
  socketStatus: SocketStatus.CONNECTING
};

export const socketStatusSlice = createSlice({
  name: 'socketStatus',
  initialState,
  reducers: {
    setStatus: (state, action: PayloadAction<TSocketStatus>) => {
      state.socketStatus = action.payload;
    },
  },
});

export const {
  setStatus,
} = socketStatusSlice.actions;
export default socketStatusSlice.reducer;