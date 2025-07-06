import { createAsyncThunk } from "@reduxjs/toolkit";
import { managePayment } from "@/services/managePayment";
import { CreatePayment, CancelPayment } from "@/types/payment";
import { AxiosError } from "axios";

export const createPayment = createAsyncThunk(
  "payment/create",
  async (req: CreatePayment, { rejectWithValue }) => {
    try {
      const response = await managePayment.createPayment(req);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Thất bại");
    }
  }
);

export const cancelPayment = createAsyncThunk(
  "payment/cancel",
  async (req: CancelPayment, { rejectWithValue }) => {
    try {
      const response = await managePayment.cancelPayment(req);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Thất bại");
    }
  }
);
