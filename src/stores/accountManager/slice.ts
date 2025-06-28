import { createSlice } from "@reduxjs/toolkit";
import { profile, driverCompanyAcc } from "./thunk";
import { Account, Driver } from "@/types/account";

type stateType = {
  loading: boolean;
  info: Account | null;
  driverInfo: {
    page: number;
    data: Driver[];
  } | null;
};

const initialState: stateType = {
  loading: false,
  info: null,
  driverInfo: null,
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
      })
      .addCase(driverCompanyAcc.pending, (state) => {
        state.loading = true;
      })
      .addCase(driverCompanyAcc.fulfilled, (state, action) => {
        state.loading = false;
        state.driverInfo = action.payload.data;
      })
      .addCase(driverCompanyAcc.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { reducer: manageAccountReducer, actions: manageAccountActions } =
  manageAccountSlice;
