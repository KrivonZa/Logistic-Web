import { createAsyncThunk } from "@reduxjs/toolkit";
import { manageOrder } from "@/services/manageOrder";
import { UpdateOrder } from "@/types/order";
import { AxiosError } from "axios";

export const companyOrder = createAsyncThunk(
  "company/order",
  async (req: { page: number; limit: number }, { rejectWithValue }) => {
    try {
      const response = await manageOrder.getOrder(req);
      return { page: req.page, data: response.data };
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Thất bại");
    }
  }
);

export const companyOrderDetail = createAsyncThunk(
  "company/orderDetail",
  async (req: string, { rejectWithValue }) => {
    try {
      const response = await manageOrder.getOrderDetail(req);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Thất bại");
    }
  }
);

export const updateOrder = createAsyncThunk(
  "company/updateOrder",
  async (req: UpdateOrder, { rejectWithValue }) => {
    try {
      const response = await manageOrder.updateOrder(req);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Thất bại");
    }
  }
);
