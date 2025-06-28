import { createSlice } from "@reduxjs/toolkit";
import { companyOrder } from "./thunk";
import { Orders } from "@/types/order";

type stateType = {
  loading: boolean;
  orders: {
    page: number;
    data: Orders[];
  } | null;
};

const initialState: stateType = {
  loading: false,
  orders: null,
};

export const manageOrderSlice = createSlice({
  name: "manageOrder",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(companyOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(companyOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.data;
      })
      .addCase(companyOrder.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { reducer: manageOrderReducer, actions: manageOrderActions } =
  manageOrderSlice;
