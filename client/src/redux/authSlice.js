import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    isLoggedIn: false,
  },
  reducers: {
    // Action to log in and set user and token
    login: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isLoggedIn = true;
    },
    // Action to clear user and token (logout)
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isLoggedIn = false;
    },
  },
});

// Export actions for components to use
export const { login, logout } = authSlice.actions;

// Export reducer to be added to the store
export default authSlice.reducer;
