import { createSlice } from "@reduxjs/toolkit";
import { createTrip } from "./thunk";

type stateType = {
  loading: boolean;
};

const initialState: stateType = {
  loading: false,
};

export const manageTripSlice = createSlice({
  name: "manageTrip",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createTrip.pending, (state) => {
        state.loading = true;
      })
      .addCase(createTrip.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createTrip.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { reducer: manageTripReducer, actions: manageTripActions } =
  manageTripSlice;
