import { createSlice } from "@reduxjs/toolkit";
import { uploadFile } from "./thunk";

type stateType = {
  loading: boolean;
};

const initialState: stateType = {
  loading: false,
};

export const manageFileSlice = createSlice({
  name: "manageFile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(uploadFile.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadFile.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(uploadFile.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { reducer: manageFileReducer, actions: manageFileActions } =
  manageFileSlice;
