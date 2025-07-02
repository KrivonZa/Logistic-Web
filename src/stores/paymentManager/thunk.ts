import { createAsyncThunk } from "@reduxjs/toolkit";
import { managePayment } from "@/services/managePayment";
import { CreatePayment, CancelPayment } from "@/types/payment";

export const createPayment = createAsyncThunk(
  "payment/create",
  async (req: CreatePayment, { rejectWithValue }) => {
    try {
      const response = await managePayment.createPayment(req);
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || "Đã xảy ra lỗi";
      return rejectWithValue(message);
    }
  }
);

export const cancelPayment = createAsyncThunk(
  "payment/cancel",
  async (req: CancelPayment, { rejectWithValue }) => {
    try {
      const response = await managePayment.cancelPayment(req);
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || "Đã xảy ra lỗi";
      return rejectWithValue(message);
    }
  }
);
