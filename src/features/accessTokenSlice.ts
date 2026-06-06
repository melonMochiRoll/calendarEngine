import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type TAccessTokenPayload = {
  token: string,
};

const initialState: TAccessTokenPayload = {
  token: '',
};

export const accessTokenSlice = createSlice({
  name: 'accessToken',
  initialState,
  reducers: {
    setAccessToken: (state, action: PayloadAction<TAccessTokenPayload>) => {
      state.token = action.payload.token;
    },
    clearAccessToken: (state) => {
      state.token = '';
    },
  },
});

export const {
  setAccessToken,
  clearAccessToken,
} = accessTokenSlice.actions;
export default accessTokenSlice.reducer;