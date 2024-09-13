import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Box,
  Typography,
  Button,
  TextField,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import SingleStoreIcon from "../assets/icons/SingleStoreIcon";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

const emailSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
});

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
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: emailErrors },
  } = useForm({
    resolver: yupResolver(emailSchema),
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
  } = useForm({
    resolver: yupResolver(passwordSchema),
  });

  const handleSendOtp = async (data) => {
    try {
      const response = await fetch(
        ` ${import.meta.env.VITE_API_BASE_URL}/user/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ email: data.email }),
        }
      );

      if (response.ok) {
        enqueueSnackbar("OTP sent successfully!", { variant: "success" });
        setIsOtpSent(true);
      } else {
        enqueueSnackbar(
          "Failed to send OTP. Please check your email address.",
          { variant: "error" }
        );
      }
    } catch (error) {
      enqueueSnackbar("Something went wrong.", { variant: "error" });
    }
  };

  const handleResetPassword = async (data) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/user/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: true,
          body: JSON.stringify({
            otp: data.otp,
            newPassword: data.newPassword,
          }),
        }
      );

      if (response.ok) {
        enqueueSnackbar("Password reset successfully!", { variant: "success" });
        navigate("/");
      } else {
        enqueueSnackbar("Failed to reset password. Please check the OTP.", {
          variant: "error",
        });
      }
    } catch (error) {
      enqueueSnackbar("Something went wrong.", { variant: "error" });
    }
  };

  return (
    <div className="flex p-4 sm:p-8 items-center justify-center min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <Box className="absolute  rounded-full bg-white opacity-20 animate-spin-slow top-1/4 left-1/4"></Box>
      <Box className="absolute rounded-full bg-white opacity-10 animate-spin-slow top-2/4 right-1/4"></Box>

      <Box className="absolute top-4 left-4 flex items-center gap-2">
        <SingleStoreIcon />
        <Typography className="font-bold text-lg sm:text-xl text-white">
          TaskPro
        </Typography>
      </Box>

      <div className="w-full  max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        {!isOtpSent ? (
          <>
            <h2 className="text-2xl font-bold text-center text-gray-800">
              Forgot Password
            </h2>
            <form
              onSubmit={handleSubmitEmail(handleSendOtp)}
              className="space-y-6"
            >
              <TextField
                id="email"
                label="Email"
                variant="outlined"
                fullWidth
                {...registerEmail("email")}
                error={!!emailErrors.email}
                helperText={emailErrors.email?.message}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{
                  backgroundColor: "#673AB7",
                  "&:hover": {
                    backgroundColor: "#5e35b1",
                  },
                }}
                F
              >
                Send OTP
              </Button>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-center text-gray-800">
              Reset Password
            </h2>
            <form
              onSubmit={handleSubmitPassword(handleResetPassword)}
              className="space-y-6"
            >
              <TextField
                id="otp"
                label="Enter OTP"
                variant="outlined"
                fullWidth
                {...registerPassword("otp")}
                error={!!passwordErrors.otp}
                helperText={passwordErrors.otp?.message}
              />

              <TextField
                id="newPassword"
                label="New Password"
                variant="outlined"
                type={showPassword ? "text" : "password"}
                fullWidth
                {...registerPassword("newPassword")}
                error={!!passwordErrors.newPassword}
                helperText={passwordErrors.newPassword?.message}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                id="confirmPassword"
                label="Confirm Password"
                variant="outlined"
                type={showPassword ? "text" : "password"}
                fullWidth
                {...registerPassword("confirmPassword")}
                error={!!passwordErrors.confirmPassword}
                helperText={passwordErrors.confirmPassword?.message}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{
                  backgroundColor: "#673AB7",
                  "&:hover": {
                    backgroundColor: "#5e35b1",
                  },
                }}
              >
                Reset Password
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
