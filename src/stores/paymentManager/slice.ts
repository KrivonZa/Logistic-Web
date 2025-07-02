import { createSlice } from "@reduxjs/toolkit";
import { createPayment, cancelPayment } from "./thunk";

type stateType = {
  loading: boolean;
};

const initialState: stateType = {
  loading: false,
};

export const managePaymentSlice = createSlice({
  name: "managePayment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createPayment.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPayment.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createPayment.rejected, (state) => {
        state.loading = false;
      })
      .addCase(cancelPayment.pending, (state) => {
        state.loading = true;
      })
      .addCase(cancelPayment.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(cancelPayment.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { reducer: managePaymentReducer, actions: managePaymentActions } =
  managePaymentSlice;
