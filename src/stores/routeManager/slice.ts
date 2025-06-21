import { createSlice } from "@reduxjs/toolkit";
import { createRoutes, getRoutesByCompany } from "./thunk";
import { Routes } from "@/types/route";

type stateType = {
  loading: boolean;
  routes: Routes[] | [];
};

const initialState: stateType = {
  loading: false,
  routes: [],
};

export const manageRouteSlice = createSlice({
  name: "manageRoute",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createRoutes.pending, (state) => {
        state.loading = true;
      })
      .addCase(createRoutes.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(createRoutes.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getRoutesByCompany.pending, (state) => {
        state.loading = true;
      })
      .addCase(getRoutesByCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.routes = action.payload.data;
      })
      .addCase(getRoutesByCompany.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { reducer: manageRouteReducer, actions: manageRouteActions } =
  manageRouteSlice;
