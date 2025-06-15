import { combineReducers } from "@reduxjs/toolkit";
import { manageAuthenReducer } from "./authentManager/slice";
import { manageAccountReducer } from "./accountManager/slice";

export const rootReducer = combineReducers({
  manageAuthen: manageAuthenReducer,
  manageAccount: manageAccountReducer,
});
