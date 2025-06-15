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
        return rejectWithValue(
          "Tài khoản không tồn tại hoặc không được phép truy cập"
        );
      }

      sessionStorage.setItem("authToken", token);
      sessionStorage.setItem("role", role);

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || "Đăng nhập thất bại"
      );
    }
  }
);

export const googleLogin = createAsyncThunk(
  "auth/googleLogin",
  async (_, { rejectWithValue }) => {
    try {
      const authUrlResponse = await manageAuthen.googleLogin();
      const authUrl = authUrlResponse.data?.data.authUrl;

      if (!authUrl) {
        return rejectWithValue("Không thể lấy URL xác thực Google");
      }

      const width = 500;
      const height = 600;
      const left = (window.screen.width - width) / 2;
      const top = (window.screen.height - height) / 2;

      const authWindow = window.open(
        authUrl,
        "_blank",
        `width=${width},height=${height},left=${left},top=${top},resizable=no`
      );
      if (!authWindow) {
        return rejectWithValue("Không thể mở popup Google");
      }

      const code = await new Promise<string>((resolve, reject) => {
        const handleMessage = (event: MessageEvent) => {
          if (event.origin !== "http://localhost:8080") return;
          const { code } = event.data;
          if (code) {
            resolve(code);
            authWindow.close();
          } else {
            reject("Không nhận được code xác thực");
          }
          window.removeEventListener("message", handleMessage);
        };
        window.addEventListener("message", handleMessage);
      });

      const tokenResponse = await manageAuthen.googleLogin(code);
      const token = tokenResponse.data?.data.access_token;
      const role = tokenResponse.data?.data.role;
      const allowedRoles = ["Company", "Coordinator", "Staff", "Admin"];

      if (!token || !role || !allowedRoles.includes(role)) {
        return rejectWithValue(
          "Tài khoản không tồn tại hoặc không được phép truy cập"
        );
      }

      sessionStorage.setItem("authToken", token);
      sessionStorage.setItem("role", role);

      return tokenResponse.data;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || "Đăng nhập thất bại"
      );
    }
  }
);
