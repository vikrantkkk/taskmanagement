import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  IconButton,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../redux/api/userApi";
import { login } from "../redux/userSlice";

// Define Yup schema for login
const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const Login = () => {
  const [showPassword, setShowPassword] = useState(false); // Toggle password visibility
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const [loginMutation, { isLoading, isError, error }] = useLoginMutation();

  const methods = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { handleSubmit } = methods;

  // Toggle show/hide password
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (data) => {
    try {
      const response = await loginMutation(data).unwrap();
      enqueueSnackbar(response?.message, { variant: "success" });
      // Save user info and token to the store
      dispatch(login(response));
      if (response?.success) {
        navigate("/verifyotp");
      }
    } catch (err) {
      console.error("Login failed:", err);
      enqueueSnackbar("Login failed. Please try again.", { variant: "error" });
    }
  };

  return (
    <FormProvider {...methods}>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm mx-auto p-4 bg-white rounded-lg shadow-lg relative"
        position="relative"
      >
        {/* Loader */}
        {isLoading && (
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(255, 255, 255, 0.8)", // Optional: to dim the background
            }}
          >
            <CircularProgress sx={{ color: "#673AB7" }} />
          </Box>
        )}

        {/* Email Field */}
        <Box mb={2}>
          <TextField
            label="Email"
            fullWidth
            {...methods.register("email")}
            error={Boolean(methods.formState.errors.email)}
            helperText={methods.formState.errors.email?.message}
            disabled={isLoading}
            sx={{
              "& .MuiInputLabel-root": {
                color: "#673AB7", // Label color
              },
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
        </Box>

        {/* Password Field with Eye Icon */}
        <Box mb={2}>
          <TextField
            label="Password"
            fullWidth
            type={showPassword ? "text" : "password"}
            {...methods.register("password")}
            error={Boolean(methods.formState.errors.password)}
            helperText={methods.formState.errors.password?.message}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleClickShowPassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            disabled={isLoading}
            sx={{
              "& .MuiInputLabel-root": {
                color: "#673AB7", // Label color
              },
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
        </Box>

        {/* Sign In Button */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={isLoading}
          sx={{
            backgroundColor: "#673AB7",
            "&:hover": {
              backgroundColor: "#5e35b1", // Hover color
            },
          }}
        >
          Sign In
        </Button>

        {/* Forgot Password */}
        <Box className="text-right mt-2">
          <Button color="primary" variant="text" disabled={isLoading}>
            Forgot Password?
          </Button>
        </Box>
      </Box>
    </FormProvider>
  );
};

export default Login;
