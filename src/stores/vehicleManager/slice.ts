import { createSlice } from "@reduxjs/toolkit";
import { getVehicle, createVehicle } from "./thunk";
import { Vehicles } from "@/types/vehicle";

type stateType = {
  loading: boolean;
  vehicles: {
    total: number;
    data: Vehicles[];
  } | null;
};

const initialState: stateType = {
  loading: false,
  vehicles: null,
};

export const manageVehicleSlice = createSlice({
  name: "manageVehicle",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getVehicle.pending, (state) => {
        state.loading = true;
      })
      .addCase(getVehicle.fulfilled, (state, action) => {
        state.loading = false;
        state.vehicles = {
          total: action.payload.total,
          data: action.payload.data,
        };
      })
      .addCase(getVehicle.rejected, (state) => {
        state.loading = false;
      })
      .addCase(createVehicle.pending, (state) => {
        state.loading = true;
      })
      .addCase(createVehicle.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createVehicle.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { reducer: manageVehicleReducer, actions: manageVehicleActions } =
  manageVehicleSlice;
