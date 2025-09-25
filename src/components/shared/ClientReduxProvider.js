// components/shared/ReduxProvider.js
"use client";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { useEffect, useState } from "react";
import { store } from "@/redux/store";

export default function ClientReduxProvider({ children }) {
  const [persistor, setPersistor] = useState(null);

  useEffect(() => {
    const p = persistStore(store);
    setPersistor(p);
  }, []);

  if (!persistor) {
    return <Provider store={store}>{children}</Provider>;
  }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
