import { createAsyncThunk } from "@reduxjs/toolkit";
import { manageOrder } from "@/services/manageOrder";
import { UpdateOrder } from "@/types/order";

export const companyOrder = createAsyncThunk(
  "company/order",
  async (req: { page: number; limit: number }, { rejectWithValue }) => {
    try {
      const response = await manageOrder.getOrder(req);
      return { page: req.page, data: response.data };
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || "Đã xảy ra lỗi";
      return rejectWithValue(message);
    }
  }
);

export const companyOrderDetail = createAsyncThunk(
  "company/orderDetail",
  async (req: string, { rejectWithValue }) => {
    try {
      const response = await manageOrder.getOrderDetail(req);
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || "Đã xảy ra lỗi";
      return rejectWithValue(message);
    }
  }
);

export const updateOrder = createAsyncThunk(
  "company/updateOrder",
  async (req: UpdateOrder, { rejectWithValue }) => {
    try {
      const response = await manageOrder.updateOrder(req);
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || "Đã xảy ra lỗi";
      return rejectWithValue(message);
    }
  }
);
