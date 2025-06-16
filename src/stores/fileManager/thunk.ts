import { createAsyncThunk } from "@reduxjs/toolkit";
import { manageFile } from "@/services/manageFile";

export const uploadFile = createAsyncThunk(
  "uploadFile",
  async (req: File, { rejectWithValue }) => {
    try {
      const response = await manageFile.uploadFile(req);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || "Thất bại");
    }
  }
);
