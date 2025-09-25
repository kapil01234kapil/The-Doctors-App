// store/store.js
import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import authSlice from './authSlice' // Adjust the import path as necessary
import scheduleSlice from './scheduleSlice'
import notificationSlice from './notificationSlice'
import adminSlice from './adminSlice'
// Persist configuration
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // only auth will be persisted
  // blacklist: ['someSlice'], // slices to exclude from persistence
}

// Combine reducers
const rootReducer = combineReducers({
  auth: authSlice,
  schedule : scheduleSlice,
  notification : notificationSlice,
  admin : adminSlice
  // Add other slices here
})

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer)

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
})

// Create persistor
export const persistor = persistStore(store)

