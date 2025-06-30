import { createAsyncThunk } from "@reduxjs/toolkit";
import { manageApplication } from "@/services/manageApplication";

export const viewCompanyApplication = createAsyncThunk(
  "",
  async (req: { page: number; limit: number }, { rejectWithValue }) => {
    try {
      const response = await manageApplication.viewApplication(req);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || "Thất bại");
    }
  }
);
