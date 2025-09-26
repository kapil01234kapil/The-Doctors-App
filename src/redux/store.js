import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import scheduleSlice from "./scheduleSlice";
import notificationSlice from "./notificationSlice";
import adminSlice from "./adminSlice";
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

const rootReducer = combineReducers({
  auth: authSlice,
  schedule: scheduleSlice,
  notification: notificationSlice,
  admin: adminSlice,
});

export const store = configureStore({
  reducer: rootReducer, // persistence will be handled later
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: process.env.NODE_ENV !== "production",
});
