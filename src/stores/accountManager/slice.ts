import { createSlice } from "@reduxjs/toolkit";
import { profile } from "./thunk";
import { Account } from "@/types/account";

type stateType = {
  loading: boolean;
  info: Account | null;
};

const initialState: stateType = {
  loading: false,
  info: null,
};

export const manageAccountSlice = createSlice({
  name: "manageAccount",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(profile.pending, (state) => {
        state.loading = true;
      })
      .addCase(profile.fulfilled, (state, action) => {
        state.loading = false;
        state.info = action.payload.account;
      })
      .addCase(profile.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { reducer: manageAccountReducer, actions: manageAccountActions } =
  manageAccountSlice;
