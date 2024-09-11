import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Box, Typography } from "@mui/material";
import SingleStoreIcon from "../assets/icons/SingleStoreIcon";

// Yup schema for email validation
const emailSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
});

// Yup schema for reset password validation
const passwordSchema = yup.object().shape({
  otp: yup
    .string()
    .length(6, "OTP must be 6 characters")
    .required("OTP is required"),
  newPassword: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("New password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword"), null], "Passwords must match")
    .required("Confirm password is required"),
});

const ForgotPasswordPage = () => {
  const [isOtpSent, setIsOtpSent] = useState(false); // State to toggle between forms

  // Form handling for Forgot Password (sending OTP)
  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: emailErrors },
  } = useForm({
    resolver: yupResolver(emailSchema),
  });

  // Form handling for Reset Password
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
  } = useForm({
    resolver: yupResolver(passwordSchema),
  });

  // Function to handle sending OTP (Forgot Password)
  const handleSendOtp = async (data) => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/v1/user/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: data.email }),
        }
      );

      if (response.ok) {
        alert("OTP sent successfully!");
        setIsOtpSent(true); // Switch to the Reset Password form
      } else {
        alert("Failed to send OTP. Please check your email address.");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("Something went wrong.");
    }
  };

  // Function to handle resetting the password (Reset Password)
  const handleResetPassword = async (data) => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/v1/user/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            otp: data.otp,
            newPassword: data.newPassword,
          }),
        }
      );

      if (response.ok) {
        alert("Password reset successfully!");
        // Optionally redirect the user or reset the form after success
      } else {
        alert("Failed to reset password. Please check the OTP.");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen overflow-hidden bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <Box className="absolute w-64 h-64 rounded-full bg-white opacity-20 animate-spin-slow top-1/4 left-1/4"></Box>
      <Box className="absolute w-96 h-96 rounded-full bg-white opacity-10 animate-spin-slow top-2/4 right-1/4"></Box>

      <Box className="absolute top-4 left-4 flex items-center gap-2">
        <SingleStoreIcon />
        <Typography className="font-bold text-lg sm:text-xl text-white">
          TaskPro
        </Typography>
      </Box>

      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        {!isOtpSent ? (
          <>
            {/* Forgot Password (Send OTP) Form */}
            <h2 className="text-2xl font-bold text-center text-gray-800">
              Forgot Password
            </h2>
            <form
              onSubmit={handleSubmitEmail(handleSendOtp)}
              className="space-y-6"
            >
              <div className="flex flex-col space-y-1">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  {...registerEmail("email")}
                />
                {emailErrors.email && (
                  <p className="text-sm text-red-500">
                    {emailErrors.email.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Send OTP
              </button>
            </form>
          </>
        ) : (
          <>
            {/* Reset Password Form */}
            <h2 className="text-2xl font-bold text-center text-gray-800">
              Reset Password
            </h2>
            <form
              onSubmit={handleSubmitPassword(handleResetPassword)}
              className="space-y-6"
            >
              <div className="flex flex-col space-y-1">
                <label
                  htmlFor="otp"
                  className="text-sm font-medium text-gray-700"
                >
                  Enter OTP
                </label>
                <input
                  id="otp"
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  {...registerPassword("otp")}
                />
                {passwordErrors.otp && (
                  <p className="text-sm text-red-500">
                    {passwordErrors.otp.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col space-y-1">
                <label
                  htmlFor="newPassword"
                  className="text-sm font-medium text-gray-700"
                >
                  New Password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  {...registerPassword("newPassword")}
                />
                {passwordErrors.newPassword && (
                  <p className="text-sm text-red-500">
                    {passwordErrors.newPassword.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col space-y-1">
                <label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  {...registerPassword("confirmPassword")}
                />
                {passwordErrors.confirmPassword && (
                  <p className="text-sm text-red-500">
                    {passwordErrors.confirmPassword.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Reset Password
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
