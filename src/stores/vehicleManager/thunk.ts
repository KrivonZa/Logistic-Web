import { createAsyncThunk } from "@reduxjs/toolkit";
import { manageVehicle } from "@/services/manageVehicle";

export const getVehicle = createAsyncThunk(
  "vehicle",
  async (req: { page: number; limit: number }, { rejectWithValue }) => {
    try {
      const response = await manageVehicle.getVehicle(req);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || "Thất bại");
    }
  }
);

export const createVehicle = createAsyncThunk(
  "vehicle/create",
  async (req: FormData, { rejectWithValue }) => {
    try {
      const response = await manageVehicle.createVehicle(req);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || "Thất bại");
    }
  }
);
