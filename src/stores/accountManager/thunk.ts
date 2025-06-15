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
