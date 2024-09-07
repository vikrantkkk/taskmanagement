import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useLoginMutation } from "../redux/api/authApi";
import { useDispatch } from "react-redux";
import { login } from "../redux/authSlice";


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
      dispatch(login(response)); // Save user info and token to the store
      console.log("Login successful:", response);
      // Redirect or perform further actions here
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <FormProvider {...methods}>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        className="w-full"
      >
        {/* Email Field */}
        <Box mb={2}>
          <TextField
            label="Email"
            fullWidth
            {...methods.register("email")}
            error={Boolean(methods.formState.errors.email)}
            helperText={methods.formState.errors.email?.message}
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
          />
        </Box>

        {/* Sign In Button */}
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Sign In
        </Button>

        {/* Forgot Password */}
        <Box className="text-right mt-2">
          <Button color="primary" variant="text">
            Forgot Password?
          </Button>
        </Box>
      </Box>
    </FormProvider>
  );
};

export default Login;
