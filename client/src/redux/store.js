// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import { authApi } from './api/authApi';
import authSlice from './authSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice, // Add your authSlice reducer here
    [authApi.reducerPath]: authApi.reducer, // Add the API reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware), // Add API middleware
});

