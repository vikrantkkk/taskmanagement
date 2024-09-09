import React, { useState, useRef } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import EmailIcon from "@mui/icons-material/Email";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { useVerifyOtpMutation } from "../redux/api/userApi";
import { verifyOtp } from "../redux/userSlice";
import SingleStoreIcon from "../assets/icons/SingleStoreIcon"; // Your logo icon

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
  const dispatch = useDispatch();
  const { email } = useSelector((state) => state.auth.user);

  // RTK Query hook for OTP verification
  const [verifyOtpMutation] = useVerifyOtpMutation();

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

  const onSubmit = async (data) => {
    try {
      const response = await verifyOtpMutation({ otp: data.otp }).unwrap();
      enqueueSnackbar(response?.message, { variant: "success" });
      dispatch(verifyOtp(response));
      if (response?.success) {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Invalid otp:", err);
      enqueueSnackbar("Invalid otp.", { variant: "error" });
    }
  };

  return (
    <Box className="min-h-screen p-4 sm:p-8 flex items-center justify-center relative overflow-hidden bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      {/* Rotating background elements */}
      <Box className="absolute w-64 h-64 rounded-full bg-white opacity-20 animate-spin-slow top-1/4 left-1/4"></Box>
      <Box className="absolute w-96 h-96 rounded-full bg-white opacity-10 animate-spin-slow top-2/4 right-1/4"></Box>

      {/* Logo in the top-left corner */}
      <Box className="absolute top-4 left-4 flex items-center gap-2">
        <SingleStoreIcon />
        <Typography className="font-bold text-lg sm:text-xl text-white">TaskPro</Typography>
      </Box>

      {/* Main form box */}
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        className="relative w-full max-w-md p-8 border border-gray-300 rounded-lg shadow-lg bg-white z-10"
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

        {/* Buttons */}
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
            onClick={() => navigate("/login")}
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
            Verify OTP
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default VerifyOtp;
