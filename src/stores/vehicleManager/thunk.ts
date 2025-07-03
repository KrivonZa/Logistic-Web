import { createAsyncThunk } from "@reduxjs/toolkit";
import { manageVehicle } from "@/services/manageVehicle";
import { toast } from "sonner";

export const getVehicle = createAsyncThunk(
  "vehicle",
  async (
    req: { page: number; limit: number; status: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await manageVehicle.getVehicle(req);
      return response.data;
    } catch (error: any) {
      const message = error?.response?.data?.message || "Thất bại";
      toast.error(message);
      return rejectWithValue(message);
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
      const message = error?.response?.data?.message || "Thất bại";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const updateVehicle = createAsyncThunk(
  "vehicle/update",
  async (
    { req, formData }: { req: string; formData: FormData },
    { rejectWithValue }
  ) => {
    try {
      const response = await manageVehicle.updateVehicle(req, formData);
      return response.data;
    } catch (error: any) {
      const message = error?.response?.data?.message || "Thất bại";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);
