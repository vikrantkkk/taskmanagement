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
      const { data, message, timestamp } = action.payload;
      localStorage.setItem("token", data.token);
      state.user = data;
      state.message = message;
      state.timestamp = timestamp;
    },

    login: (state, action) => {
      const { data, message, timestamp } = action.payload;
      localStorage.setItem("token", data.token);
      state.user = data;
      state.message = message;
      state.timestamp = timestamp;
    },
    verifyOtp: (state, action) => {
      const { data } = action.payload;
      state.user = data;
      state.isLoggedIn = data?.user?.isVerified;
    },
    updateUserProfile: (state, action) => {
      const { data } = action.payload;
      state.user = data;
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isLoggedIn = false;
    },
    resetUser: (state) => {
      state.user = null;
    },
  },
});

export const {
  register,
  login,
  verifyOtp,
  updateUserProfile,
  logout,
  resetUser,
} = authSlice.actions;

export default authSlice.reducer;
