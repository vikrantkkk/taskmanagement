import React, { useState, useRef } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import EmailIcon from "@mui/icons-material/Email";
import { useSelector } from "react-redux";
import { useVerifyOtpMutation } from "../redux/api/userApi";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

// Utility function to get a specific cookie value
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
};

// Validation schema
const otpSchema = yup.object().shape({
  otp: yup
    .string()
    .length(6, "OTP must be exactly 6 digits")
    .matches(/^\d+$/, "OTP must be digits only")
    .required("OTP is required"),
});

const VerifyOtp = () => {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const inputsRef = useRef([]);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { email } = useSelector((state) => state.auth.user);

  const { handleSubmit, control, setValue, formState } = useForm({
    resolver: yupResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  const { errors } = formState;

  const handleChange = (e, index) => {
    const value = e.target.value;
    const newOtp = [...otp];
    newOtp[index] = value.slice(0, 1);
    setOtp(newOtp);
    setValue("otp", newOtp.join(""));

    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const [verifyOtpMutation, { isLoading }] = useVerifyOtpMutation();

  const onSubmit = async (data) => {
    try {
      const token = getCookie('token');
      console.log("🚀 ~ onSubmit ~ token:", token)
      const response = await verifyOtpMutation({ otp: data.otp, token }).unwrap();
      enqueueSnackbar(response?.message, { variant: "success" });
      if (response?.success) {
        navigate("/dashboard");
      }
    } catch (err) {
      enqueueSnackbar("Invalid OTP. Please try again.", { variant: "error" });
    }
  };

  return (
    <Box className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md p-8 border border-gray-300 rounded-lg shadow-lg bg-white"
      >
        <Box className="flex justify-center mb-4">
          <EmailIcon sx={{ fontSize: "3rem", color: "#673AB7" }} />
        </Box>
        <Typography
          className="text-[#673AB7] mb-2 text-center text-2xl font-bold"
          variant="h5"
          gutterBottom
        >
          Verify Your OTP
        </Typography>
        <Typography variant="body1" gutterBottom align="center" mb={2}>
          Please check your email
        </Typography>
        <Typography variant="body2" gutterBottom align="center" mb={4}>
          We've sent a code to <strong>{email}</strong>
        </Typography>

        {/* OTP Fields */}
        <Box
          mb={4}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          className="gap-2"
        >
          {otp.map((value, index) => (
            <Controller
              key={index}
              name={`otp${index}`}
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  value={value}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  inputRef={(ref) => (inputsRef.current[index] = ref)}
                  variant="outlined"
                  inputProps={{ maxLength: 1 }}
                  sx={{
                    width: "60px",
                    textAlign: "center",
                    borderRadius: "8px",
                    borderColor: "#673AB7",
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#673AB7", // Border color when not focused
                      },
                      "&:hover fieldset": {
                        borderColor: "#5e35b1", // Border color on hover
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#673AB7", // Border color when focused
                      },
                    },
                  }}
                />
              )}
            />
          ))}
        </Box>

        {/* Error Message */}
        {errors.otp && (
          <Typography color="error.main" align="center" mb={2}>
            {errors.otp.message}
          </Typography>
        )}

        <Box className="flex items-center justify-center gap-4 w-full mt-4">
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            sx={{
              borderColor: "#673AB7",
              color: "#673AB7",
              "&:hover": { borderColor: "#673AB7", backgroundColor: "#EDE7F6" },
            }}
            onClick={() => navigate('/login')} // Redirect to login page if needed
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              backgroundColor: "#673AB7",
              "&:hover": { backgroundColor: "#5e35b1" },
            }}
          >
            {isLoading ? "Verifying..." : "Verify OTP"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default VerifyOtp;
