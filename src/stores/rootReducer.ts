import { combineReducers } from "@reduxjs/toolkit";
import { manageAuthenReducer } from "./authentManager/slice";
import { manageAccountReducer } from "./accountManager/slice";
import { manageBankReducer } from "./bankManager/slice";
import { manageRouteReducer } from "./routeManager/slice";
import { manageFileReducer } from "./fileManager/slice";
import { manageOrderReducer } from "./orderManager/slice";
import { manageApplicationReducer } from "./applicationManager/slice";
import { managePaymentReducer } from "./paymentManager/slice";
import { manageVehicleReducer } from "./vehicleManager/slice";
import { manageVehicle } from "@/services/manageVehicle";

export const rootReducer = combineReducers({
  manageAuthen: manageAuthenReducer,
  manageAccount: manageAccountReducer,
  manageBank: manageBankReducer,
  manageRoute: manageRouteReducer,
  manageFile: manageFileReducer,
  manageOrder: manageOrderReducer,
  manageApplication: manageApplicationReducer,
  managePayment: managePaymentReducer,
  manageVehicle: manageVehicleReducer,
});
