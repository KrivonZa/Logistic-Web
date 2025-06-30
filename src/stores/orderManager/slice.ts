import { createSlice } from "@reduxjs/toolkit";
import { companyOrder, companyOrderDetail, updateOrder } from "./thunk";
import { Orders, DeliveryOrderDetail } from "@/types/order";

type stateType = {
  loading: boolean;
  orders: {
    page: number;
    data: Orders[];
  } | null;
  orderDetail: DeliveryOrderDetail | null;
};

const initialState: stateType = {
  loading: false,
  orders: null,
  orderDetail: null,
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
      })
      .addCase(companyOrderDetail.pending, (state) => {
        state.loading = true;
      })
      .addCase(companyOrderDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.orderDetail = action.payload.data;
      })
      .addCase(companyOrderDetail.rejected, (state) => {
        state.loading = false;
      })
      .addCase(updateOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateOrder.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateOrder.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { reducer: manageOrderReducer, actions: manageOrderActions } =
  manageOrderSlice;
