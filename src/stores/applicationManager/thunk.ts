import { createAsyncThunk } from "@reduxjs/toolkit";
import { manageApplication } from "@/services/manageApplication";
import { CreateApplication } from "@/types/application";

export const viewCompanyApplication = createAsyncThunk(
  "application/view",
  async (req: { page: number; limit: number }, { rejectWithValue }) => {
    try {
      const response = await manageApplication.viewApplication(req);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || "Thất bại");
    }
  }
);

export const createApplication = createAsyncThunk(
  "application/create",
  async (req: CreateApplication, { rejectWithValue }) => {
    try {
      const response = await manageApplication.createApplication(req);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || "Thất bại");
    }
  }
);

export const viewAllApplication = createAsyncThunk(
  "application/viewAll",
  async (
    req: { page: number; limit: number; applicationStatus?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await manageApplication.viewAllApplication(req);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || "Thất bại");
    }
  }
);

export const viewApplicationDetail = createAsyncThunk(
  "application/viewDetail",
  async (req: string, { rejectWithValue }) => {
    try {
      const response = await manageApplication.viewApplicationDetail(req);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || "Thất bại");
    }
  }
);

export const reviewApplication = createAsyncThunk(
  "application/review",
  async (req: FormData, { rejectWithValue }) => {
    try {
      const response = await manageApplication.reviewApplication(req);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || "Thất bại");
    }
  }
);
