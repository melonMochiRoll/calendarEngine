import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getItem, setItem } from "Src/lib/localStorage";
import { TChatPayload } from "Src/typings/types";

type TLocalChatData = {
  chats: TChatPayload[],
  beforeChatId: number,
  afterChatId: number,
};

const initialState: TLocalChatData = {
  chats: [],
  beforeChatId: 0,
  afterChatId: 0,
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    getLocalChatData: (state, action: PayloadAction<string | undefined>) => {
      if (!action.payload) {
        return;
      }

      const localChatData = getItem(`chatData:${action.payload}`);
      state = localChatData;
    },
    setLocalChatData: (state, action: PayloadAction<{ url: string | undefined, data: TLocalChatData }>) => {
      const { url, data } = action.payload;

      setItem(`chatData:${url}`, data);
      state = data;
    },
    setLastChatId: (state, action: PayloadAction<{ url: string | undefined, lastChatId: number }>) => {
      const { url, lastChatId } = action.payload;
      const prevChatData = getItem(`chatData:${url}`);
      prevChatData.lastChatId = lastChatId;

      setItem(`chatData:${url}`, prevChatData);
      state = prevChatData;
    },
  },
});

export const {
  getLocalChatData,
  setLocalChatData,
  setLastChatId,
} = chatSlice.actions;
export default chatSlice.reducer;