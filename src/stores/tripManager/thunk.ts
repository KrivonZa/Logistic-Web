import { createAsyncThunk } from "@reduxjs/toolkit";
import { manageTrip } from "@/services/manageTrip";
import { CreateTrip } from "@/types/trip";
import { AxiosError } from "axios";

export const createTrip = createAsyncThunk(
  "trip/create",
  async (req: CreateTrip, { rejectWithValue }) => {
    try {
      const response = await manageTrip.createTrip(req);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Thất bại");
    }
  }
);
