import { createAsyncThunk } from "@reduxjs/toolkit";
import { manageTrip } from "@/services/manageTrip";
import { CreateTrip } from "@/types/trip";

export const createTrip = createAsyncThunk(
  "trip/create",
  async (req: CreateTrip, { rejectWithValue }) => {
    try {
      const response = await manageTrip.createTrip(req);
      return response.data;
    } catch (error: any) {
      const message = error?.response?.data?.message || "Thất bại";
      return rejectWithValue(message);
    }
  }
);
