import { createAsyncThunk } from "@reduxjs/toolkit";
import { manageRoute } from "@/services/manageRoute";
import { createRoute, Page } from "@/types/route";

export const createRoutes = createAsyncThunk(
  "createRoutes",
  async (req: createRoute, { rejectWithValue }) => {
    try {
      const response = await manageRoute.createRoute(req);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || "Thất bại");
    }
  }
);

export const getRoutesByCompany = createAsyncThunk(
  "getRoutesByCompany",
  async (req: { page: number; limit: number }, { rejectWithValue }) => {
    try {
      const response = await manageRoute.getRouteByCompany(req);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || "Thất bại");
    }
  }
);
