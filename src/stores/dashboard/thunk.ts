import { createAsyncThunk } from "@reduxjs/toolkit";
import { manageDashboard } from "@/services/manageDashboard";
import { AxiosError } from "axios";

export const companyDashboard = createAsyncThunk(
  "dashboard/company",
  async (_, { rejectWithValue }) => {
    try {
      const response = await manageDashboard.companyDashboard();
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Thất bại");
    }
  }
);

export const adminDashboard = createAsyncThunk(
  "dashboard/admin",
  async (_, { rejectWithValue }) => {
    try {
      const response = await manageDashboard.adminDashboard();
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Thất bại");
    }
  }
);
