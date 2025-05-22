// thunk.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import { manageAuthen } from "@/services/manageAuthen";
import { Login } from "@/types/account";

export const login = createAsyncThunk(
  "auth/login",
  async (req: Login, { rejectWithValue }) => {
    try {
      const response = await manageAuthen.login(req);
      const token = response.data?.data.access_token;
      const role = response.data?.data.role;
      const allowedRoles = ["Company", "Coordinator", "Staff", "Admin"];

      if (!token || !role || !allowedRoles.includes(role)) {
        return rejectWithValue("Unauthenticated or unauthorized");
      }

      sessionStorage.setItem("authToken", token);
      sessionStorage.setItem("role", role);

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || "Login failed");
    }
  }
);
