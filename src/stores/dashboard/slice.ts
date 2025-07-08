import { createSlice } from "@reduxjs/toolkit";
import { companyDashboard, adminDashboard } from "./thunk";
import {
  DashboardCompanyResponse,
  AdminDashboardResponse,
} from "@/types/dashboard";

type stateType = {
  loading: boolean;
  company: DashboardCompanyResponse | null;
  admin: AdminDashboardResponse | null;
};

const initialState: stateType = {
  loading: false,
  company: null,
  admin: null,
};

export const manageDashboardSlice = createSlice({
  name: "manageDashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(companyDashboard.pending, (state) => {
        state.loading = true;
      })
      .addCase(companyDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.company = action.payload.data;
      })
      .addCase(companyDashboard.rejected, (state) => {
        state.loading = false;
      })
      .addCase(adminDashboard.pending, (state) => {
        state.loading = true;
      })
      .addCase(adminDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload.data;
      })
      .addCase(adminDashboard.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const {
  reducer: manageDashboardReducer,
  actions: manageDashboardActions,
} = manageDashboardSlice;
