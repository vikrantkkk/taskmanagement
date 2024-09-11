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
import { useRegisterMutation } from "../redux/api/userApi";
import { register } from "../redux/userSlice";
import { useSnackbar } from "notistack";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

// Define Yup schema for registration
const registerSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [registerMutation, { isLoading }] = useRegisterMutation();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const methods = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { handleSubmit } = methods;

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const onSubmit = async (data) => {
    const { confirmPassword, ...payload } = data; // Exclude confirmPassword from the payload
    try {
      const response = await registerMutation(payload).unwrap();
      enqueueSnackbar(response?.message, { variant: "success" });
      localStorage.setItem("userId",response?.data?._id)
      // Save user info and token to the store
      dispatch(register(response));
      if (response?.success) {
        navigate("/verifyotp");
      }
    } catch (error) {
      setError(error.message || "Registration failed");
    }
  };

  return (
    <FormProvider {...methods}>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md mx-auto p-4 bg-white rounded-lg shadow-lg relative"
      >
        {/* Name Field */}
        <Box mb={2}>
          <TextField
            label="Name"
            fullWidth
            {...methods.register("name")}
            error={Boolean(methods.formState.errors.name)}
            helperText={methods.formState.errors.name?.message}
          />
        </Box>

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

        {/* Confirm Password Field with Eye Icon */}
        <Box mb={2}>
          <TextField
            label="Confirm Password"
            fullWidth
            type={showConfirmPassword ? "text" : "password"}
            {...methods.register("confirmPassword")}
            error={Boolean(methods.formState.errors.confirmPassword)}
            helperText={methods.formState.errors.confirmPassword?.message}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowConfirmPassword}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Sign Up Button */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{
            backgroundColor: "#673AB7",
            "&:hover": {
              backgroundColor: "#5e35b1", // Hover color
            },
          }}
          disabled={isLoading} // Disable button when loading
        >
          {isLoading ? "Signing Up..." : "Sign Up"}
        </Button>

        {/* Error Message Display */}
        {error && (
          <Box mt={2}>
            <p className="text-red-500 text-center">{error}</p>
          </Box>
        )}
      </Box>
    </FormProvider>
  );
};

export default Register;
