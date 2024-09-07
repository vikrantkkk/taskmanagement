import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
    isLoggedIn: false,
    message: "",
    timestamp: null,
  },
  reducers: {
    // Action to log in and set user and token
    login: (state, action) => {
      const { data, message, success, timestamp } = action.payload;
      console.log("🚀 ~ data:", data)
      state.user = data;  // Store the user data
      state.token = data.token; // Assuming token is in data object
      state.isLoggedIn = success;
      state.message = message;
      state.timestamp = timestamp;
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
