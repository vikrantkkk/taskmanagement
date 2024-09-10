import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Use localStorage as the default storage
import authReducer from './userSlice';
import taskReducer from './taskSlice';
import { authApi } from './api/userApi';
import { taskApi } from './api/taskApi';

// Persist configuration
const persistConfig = {
  key: 'root',
  version: 1,
  storage,
};

// Create the persisted reducers
const persistedAuthReducer = persistReducer(persistConfig, authReducer);
const persistedTaskReducer = persistReducer(persistConfig, taskReducer);

const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    task: persistedTaskReducer,
    [authApi.reducerPath]: authApi.reducer,
    [taskApi.reducerPath]: taskApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(taskApi.middleware), // Added middleware for taskApi
});

export const persistor = persistStore(store);

export default store;
