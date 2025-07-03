import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type TCsrfTokenPayload = {
  token: string,
};

const initialState: TCsrfTokenPayload = {
  token: '',
};

export const csrfTokenSlice = createSlice({
  name: 'csrfToken',
  initialState,
  reducers: {
    setCsrfToken: (state, action: PayloadAction<TCsrfTokenPayload>) => {
      state.token = action.payload.token;
    },
    clearCsrfToken: (state) => {
      state.token = '';
    },
  },
});

export const {
  setCsrfToken,
  clearCsrfToken,
} = csrfTokenSlice.actions;
export default csrfTokenSlice.reducer;