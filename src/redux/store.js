// store/store.js
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import authSlice from "./authSlice";
import scheduleSlice from "./scheduleSlice";
import notificationSlice from "./notificationSlice";
import adminSlice from "./adminSlice";

let storage;
if (typeof window !== "undefined") {
  storage = require("redux-persist/lib/storage").default; // localStorage only in browser
}

const persistConfig = {
  key: "root",
  storage: storage || undefined,
  whitelist: ["auth"], // only auth slice persisted
};

const rootReducer = combineReducers({
  auth: authSlice,
  schedule: scheduleSlice,
  notification: notificationSlice,
  admin: adminSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
  devTools: process.env.NODE_ENV !== "production",
});

export let persistor;
if (typeof window !== "undefined") {
  const { persistStore } = require("redux-persist");
  persistor = persistStore(store);
}
