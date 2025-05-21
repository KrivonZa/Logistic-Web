import { createAsyncThunk } from "@reduxjs/toolkit";
import { manageAuthen } from "@/services/manageAuthen";
import { Login } from "@/types/account";

export const login = createAsyncThunk(
  "auth/login",
  async (req: Login, { rejectWithValue }) => {
    try {
      const response = await manageAuthen.login(req);
      console.log(response);
      const token = response.data?.data.access_token;
      const role = response.data?.data.role;
      if (token && role) {
        sessionStorage.setItem("authToken", token);
        sessionStorage.setItem("role", role);
      }
      return response.data;
    } catch (error) {
      console.log("API error:", error);
      return rejectWithValue(error);
    }
  }
);
