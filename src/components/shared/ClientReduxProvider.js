"use client";

import React, { useState, useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "@/redux/store";

export default function ClientReduxProvider({ children }) {
  const [PersistGate, setPersistGate] = useState(null);
  const [persistor, setPersistor] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function initPersist() {
      const { persistStore, persistReducer } = await import("redux-persist");
      const storage = (await import("redux-persist/lib/storage")).default;
      const { combineReducers } = await import("@reduxjs/toolkit");

      const persistConfig = {
        key: "root",
        storage,
        whitelist: ["auth"],
      };

      const rootReducer = combineReducers({
        auth: (await import("@/redux/authSlice")).default,
        schedule: (await import("@/redux/scheduleSlice")).default,
        notification: (await import("@/redux/notificationSlice")).default,
        admin: (await import("@/redux/adminSlice")).default,
      });

      const persistedReducer = persistReducer(persistConfig, rootReducer);

      store.replaceReducer(persistedReducer);

      const { PersistGate } = await import(
        "redux-persist/integration/react"
      );

      setPersistGate(() => PersistGate);
      setPersistor(persistStore(store));
      setIsReady(true);
    }

    if (typeof window !== "undefined") {
      initPersist();
    }
  }, []);

  return (
    <Provider store={store}>
      {PersistGate && persistor && isReady ? (
        <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
          {children}
        </PersistGate>
      ) : (
        children
      )}
    </Provider>
  );
}
