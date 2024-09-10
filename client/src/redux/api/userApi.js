// src/redux/api/authApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define the base URL for your API
const BASE_URL = "http://localhost:5000/api/v1/user/"; // Replace with your API URL

// Create an API slice with Redux Toolkit
export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      // Get the token from the state (if available) and set the Authorization header
      const token = localStorage.getItem("token")
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Mutation for user registration
    register: builder.mutation({
      query: (userData) => ({
        url: "register",
        method: "POST",
        body: userData,
      }),
    }),
    // Mutation for user login
    login: builder.mutation({
      query: (loginData) => ({
        url: "login",
        method: "POST",
        body: loginData,
      }),
    }),
    // Mutation for OTP verification
    verifyOtp: builder.mutation({
      query: (otpData) => ({
        url: "verify-otp",
        method: "POST",
        body: otpData,
      }),
    }),
    updateUserProfile: builder.mutation({
      query: (userData) => ({
        url: "update-user-profile",
        method: "PUT",
        body: userData,
      }),
    }),
  }),
});

// Export hooks for the defined mutations
export const { useRegisterMutation, useLoginMutation, useVerifyOtpMutation,useUpdateUserProfileMutation } = authApi;
