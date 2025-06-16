import { createAsyncThunk } from "@reduxjs/toolkit";
import { manageBank } from "@/services/manageBank";

export const bankList = createAsyncThunk(
  "bankList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await manageBank.bankList();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || "Thất bại");
    }
  }
);
