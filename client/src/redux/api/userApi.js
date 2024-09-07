// src/redux/api/authApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/v1/user/", // Replace with your API URL
  }),
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (userData) => ({
        url: "register",
        method: "POST",
        body: userData,
      }),
    }),
    login: builder.mutation({
      query: (loginData) => ({
        url: "login",
        method: "POST",
        body: loginData,
      }),
    }),
    verifyOtp: builder.mutation({
      query: ( otp ) => ({
        url: "verify-otp",
        method: "POST",
        body: { otp },
      }),
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation, useVerifyOtpMutation } =
  authApi;
