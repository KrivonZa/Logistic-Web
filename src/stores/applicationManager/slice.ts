import { createSlice } from "@reduxjs/toolkit";
import {
  viewCompanyApplication,
  createApplication,
  viewAllApplication,
  viewApplicationDetail,
  reviewApplication,
} from "./thunk";
import { ApplicationResponse } from "@/types/application";

type stateType = {
  loading: boolean;
  applications: {
    page: number;
    data: ApplicationResponse[];
  } | null;
  allApplication: {
    data: ApplicationResponse[];
    page: number;
    total: number;
    limit: number;
  } | null;
  applicationDetail: ApplicationResponse | null;
};

const initialState: stateType = {
  loading: false,
  applications: null,
  allApplication: null,
  applicationDetail: null,
};

export const manageApplicationSlice = createSlice({
  name: "manageApplication",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(viewCompanyApplication.pending, (state) => {
        state.loading = true;
      })
      .addCase(viewCompanyApplication.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = action.payload;
      })
      .addCase(viewCompanyApplication.rejected, (state) => {
        state.loading = false;
      })
      .addCase(createApplication.pending, (state) => {
        state.loading = true;
      })
      .addCase(createApplication.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createApplication.rejected, (state) => {
        state.loading = false;
      })
      .addCase(viewAllApplication.pending, (state) => {
        state.loading = true;
      })
      .addCase(viewAllApplication.fulfilled, (state, action) => {
        state.loading = false;
        state.allApplication = action.payload;
      })
      .addCase(viewAllApplication.rejected, (state) => {
        state.loading = false;
      })
      .addCase(viewApplicationDetail.pending, (state) => {
        state.loading = true;
      })
      .addCase(viewApplicationDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.applicationDetail = action.payload.data;
      })
      .addCase(viewApplicationDetail.rejected, (state) => {
        state.loading = false;
      })
      .addCase(reviewApplication.pending, (state) => {
        state.loading = true;
      })
      .addCase(reviewApplication.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(reviewApplication.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const {
  reducer: manageApplicationReducer,
  actions: manageApplicationActions,
} = manageApplicationSlice;
