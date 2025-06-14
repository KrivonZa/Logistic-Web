import { createSlice } from "@reduxjs/toolkit";
import { login, googleLogin } from "./thunk";
import { toast } from "sonner";

type stateType = {
  loading: boolean;
};

const initialState: stateType = {
  loading: false,
};

export const manageAuthenSlice = createSlice({
  name: "manageAuthen",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        toast.success("Đăng nhập thành công", {
          style: {
            backgroundColor: "#005cb8",
            color: "#fff",
          },
        });
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;

        const message = action.payload === "Unauthenticated or unauthorized"
          ? "Bạn không có quyền truy cập vào trang này"
          : "Email hoặc mật khẩu không đúng";

        toast.error(message, {
          style: {
            backgroundColor: "#ff0033",
            color: "#fff",
          },
        });
      })
      .addCase(googleLogin.pending, (state) => {
        state.loading = true;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.loading = false;
        toast.success("Đăng nhập Google thành công", {
          style: {
            backgroundColor: "#005cb8",
            color: "#fff",
          },
        });
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload as string || "Đăng nhập Google thất bại", {
          style: {
            backgroundColor: "#ff0033",
            color: "#fff",
          },
        });
      });
  },
});

export const { reducer: manageAuthenReducer, actions: manageAuthenActions } =
  manageAuthenSlice;
