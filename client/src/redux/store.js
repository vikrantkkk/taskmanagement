import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; 
import authReducer from './userSlice';
import taskReducer from './taskSlice';
import { authApi } from './api/userApi';
import { taskApi } from './api/taskApi';


const persistConfig = {
  key: 'root',
  version: 1,
  storage,
};


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
      .concat(taskApi.middleware),
});

export const persistor = persistStore(store);

export default store;
