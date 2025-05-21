import { createSlice } from "@reduxjs/toolkit";
import { login } from "./thunk";
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
      .addCase(login.fulfilled, (state) => {
        state.loading = false;
        toast.success("Đăng nhập thành công", {
          style: {
            backgroundColor: "#005cb8",
            color: "#fff",
          },
        });
      })
      .addCase(login.rejected, (state) => {
        state.loading = false;
        toast.error("Tài khoản không hợp lệ", {
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
