import { createAsyncThunk } from "@reduxjs/toolkit";
import { manageAccount } from "@/services/manageAccount";

export const profile = createAsyncThunk(
  "account",
  async (_, { rejectWithValue }) => {
    try {
      const response = await manageAccount.profile();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || "Thất bại");
    }
  }
);

export const updateStatus = createAsyncThunk(
  "account/updateStatus",
  async (
    { accountID, status }: { accountID: string; status: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await manageAccount.updateStatus(accountID, status);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || "Thất bại");
    }
  }
);

export const driverCompanyAcc = createAsyncThunk(
  "company/driver",
  async (req: { page: number; limit: number }, { rejectWithValue }) => {
    try {
      const response = await manageAccount.getCompanyDriverAcc(req);
      return { page: req.page, data: response.data };
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || "Đã xảy ra lỗi";
      return rejectWithValue(message);
    }
  }
);

export const getCustomer = createAsyncThunk(
  "admin/get-customer",
  async (
    req: {
      page: number;
      limit: number;
      status?: string;
      search?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await manageAccount.getCustomerAcc(req);
      return {
        page: req.page,
        data: response.data,
      };
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || "Đã xảy ra lỗi";
      return rejectWithValue(message);
    }
  }
);

export const getCompany = createAsyncThunk(
  "admin/get-company",
  async (
    req: {
      page: number;
      limit: number;
      status?: string;
      search?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await manageAccount.getCompanyAcc(req);
      return {
        page: req.page,
        data: response.data,
      };
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || "Đã xảy ra lỗi";
      return rejectWithValue(message);
    }
  }
);

export const getDriver = createAsyncThunk(
  "admin/get-driver",
  async (
    req: {
      page: number;
      limit: number;
      companyName?: string;
      status?: string;
      search?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await manageAccount.getDriverAcc(req);
      return {
        page: req.page,
        data: response.data,
      };
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || "Đã xảy ra lỗi";
      return rejectWithValue(message);
    }
  }
);
