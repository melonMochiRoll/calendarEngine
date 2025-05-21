import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ModalPayload } from "Typings/types";

const initialState: ModalPayload[] = [];

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<ModalPayload>) => {
      state.push(action.payload);
    },
    closeModal: (state) => {
      state.pop();
    },
  },
});

export const {
  openModal,
  closeModal,
} = modalSlice.actions;
export default modalSlice.reducer;