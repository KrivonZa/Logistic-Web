import { createAsyncThunk } from "@reduxjs/toolkit";
import { manageBank } from "@/services/manageBank";
import { AxiosError } from "axios";

export const bankList = createAsyncThunk(
  "bankList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await manageBank.bankList();
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Thất bại");
    }
  }
);
