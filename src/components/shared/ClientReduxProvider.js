"use client";

import React from "react";
import { Provider } from "react-redux";
import dynamic from "next/dynamic";
import { store, persistor } from "@/redux/store";

// Dynamically import PersistGate
const PersistGate = dynamic(
  () =>
    import("redux-persist/integration/react").then((mod) => mod.PersistGate),
  { ssr: false }
);

export default function ClientReduxProvider({ children }) {
  return (
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
