import { createSlice } from "@reduxjs/toolkit";
import { createRoutes } from "./thunk";
import { createRoute } from "@/types/route";

type stateType = {
  loading: boolean;
  create: createRoute[] | [];
};

const initialState: stateType = {
  loading: false,
  create: [],
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
      });
  },
});

export const { reducer: manageRouteReducer, actions: manageRouteActions } =
  manageRouteSlice;
