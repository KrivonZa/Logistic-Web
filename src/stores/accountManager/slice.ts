import { createSlice } from "@reduxjs/toolkit";
import {
  profile,
  driverCompanyAcc,
  getCustomer,
  getCompany,
  getDriver,
  updateStatus,
} from "./thunk";
import { Account, Driver, AccountWithRoleDetail } from "@/types/account";

type stateType = {
  loading: boolean;
  info: Account | null;
  driverInfo: {
    page: number;
    data: Driver[];
  } | null;
  customerAccounts: {
    total: number;
    data: AccountWithRoleDetail[];
  } | null;
  companyAccounts: {
    total: number;
    data: AccountWithRoleDetail[];
  } | null;
  driverAccounts: {
    total: number;
    data: AccountWithRoleDetail[];
  } | null;
};

const initialState: stateType = {
  loading: false,
  info: null,
  driverInfo: null,
  customerAccounts: null,
  companyAccounts: null,
  driverAccounts: null,
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
      })
      .addCase(getCustomer.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.customerAccounts = {
          total: action.payload.data.total,
          data: action.payload.data.data,
        };
      })
      .addCase(getCustomer.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getCompany.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.companyAccounts = {
          total: action.payload.data.total,
          data: action.payload.data.data,
        };
      })
      .addCase(getCompany.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getDriver.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDriver.fulfilled, (state, action) => {
        state.loading = false;
        state.driverAccounts = {
          total: action.payload.data.total,
          data: action.payload.data.data,
        };
      })
      .addCase(getDriver.rejected, (state) => {
        state.loading = false;
      })
      .addCase(updateStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateStatus.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateStatus.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { reducer: manageAccountReducer, actions: manageAccountActions } =
  manageAccountSlice;
