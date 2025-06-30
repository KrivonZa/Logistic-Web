import { createSlice } from "@reduxjs/toolkit";
import { viewCompanyApplication } from "./thunk";
import { ApplicationResponse } from "@/types/application";

type stateType = {
  loading: boolean;
  applications: {
    page: number;
    data: ApplicationResponse[];
  } | null;
};

const initialState: stateType = {
  loading: false,
  applications: null,
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
      });
  },
});

export const {
  reducer: manageApplicationReducer,
  actions: manageApplicationActions,
} = manageApplicationSlice;
