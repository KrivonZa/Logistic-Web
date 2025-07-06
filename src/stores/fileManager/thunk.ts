import { createAsyncThunk } from "@reduxjs/toolkit";
import { manageFile } from "@/services/manageFile";
import { AxiosError } from "axios";

export const uploadFile = createAsyncThunk(
  "uploadFile",
  async (req: File, { rejectWithValue }) => {
    try {
      const response = await manageFile.uploadFile(req);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Thất bại");
    }
  }
);
