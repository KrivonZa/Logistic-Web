import { createAsyncThunk } from "@reduxjs/toolkit";
import { manageAccount } from "@/services/manageAccount";

export const profile = createAsyncThunk(
  "account",
  async (_, { rejectWithValue }) => {
    try {
      const response = await manageAccount.profile();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || "Thất bại");
    }
  }
);

export const driverCompanyAcc = createAsyncThunk(
  "company/driver",
  async (req: { page: number; limit: number }, { rejectWithValue }) => {
    try {
      const response = await manageAccount.getCompanyDriverAcc(req);
      return { page: req.page, data: response.data };
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || "Đã xảy ra lỗi";
      return rejectWithValue(message);
    }
  }
);
