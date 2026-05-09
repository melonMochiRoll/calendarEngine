import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SocketStatus } from "Src/constants/constants";

const initialState = {
  status: SocketStatus.CONNECTING,
};

export const chatSocketStatusSlice = createSlice({
  name: 'chatSocketStatus',
  initialState,
  reducers: {
    setChatSocketStatus: (state, action: PayloadAction<string>) => {
      state.status = action.payload;
    },
  },
});

export const {
  setChatSocketStatus,
} = chatSocketStatusSlice.actions;
export default chatSocketStatusSlice.reducer;