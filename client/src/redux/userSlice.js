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
    register: (state, action) => {
      const { data, message, success, timestamp } = action.payload;
      localStorage.setItem("token", data.token);
      state.user = data; // Store the user data
      state.isLoggedIn = success;
      state.message = message;
      state.timestamp = timestamp;
    },
    // Action to log in and set user and token
    login: (state, action) => {
      const { data, message, success, timestamp } = action.payload;
      localStorage.setItem("token", data.token);
      state.user = data; // Store the user data
      state.isLoggedIn = success;
      state.message = message;
      state.timestamp = timestamp;
    },
    verifyOtp: (state, action) => {
      const { data } = action.payload;
      state.user = data;
    },
    updateUserProfile: (state, action) => {
      const { data } = action.payload;
      console.log("🚀 ~ data:", data)
      state.user = data;
    },
    // Action to clear user and token (logout)
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isLoggedIn = false;
    },
    resetUser: (state) => {
      state.user = null; // Clear all tasks
    },
  },
});

// Export actions for components to use
export const { register, login, verifyOtp, updateUserProfile, logout,resetUser } =
  authSlice.actions;

// Export reducer to be added to the store
export default authSlice.reducer;
