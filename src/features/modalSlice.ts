import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ModalPayload } from "Typings/types";

const initialState: ModalPayload = {
  name: '',
  props: {},
};

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state: ModalPayload, action: PayloadAction<ModalPayload>) => {
      state.name = action.payload.name;
      state.props = action.payload.props;
    },
    closeModal: (state) => {
      state.name = '';
      state.props = {};
    },
  },
});

export const {
  openModal,
  closeModal,
} = modalSlice.actions;
export default modalSlice.reducer;