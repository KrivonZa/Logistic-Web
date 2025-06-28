import { createAsyncThunk } from "@reduxjs/toolkit";
import { manageOrder } from "@/services/manageOrder";

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
