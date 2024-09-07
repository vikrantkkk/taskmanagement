import React, { useState } from "react";
import { Box, Button, TextField, IconButton, InputAdornment } from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Visibility, VisibilityOff } from "@mui/icons-material";

// Define Yup schema for registration
const registerSchema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
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

  const methods = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      firstName: "",
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

  const onSubmit = (data) => {
    console.log("Register data:", data);
    // Perform registration logic here
  };

  return (
    <FormProvider {...methods}>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md mx-auto p-4 bg-white rounded-lg shadow-lg relative"
      >
        {/* First Name Field */}
        <Box mb={2}>
          <TextField
            label="First Name"
            fullWidth
            {...methods.register("firstName")}
            error={Boolean(methods.formState.errors.firstName)}
            helperText={methods.formState.errors.firstName?.message}
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

        {/* Email Field */}
        <Box mb={2}>
          <TextField
            label="Email"
            fullWidth
            {...methods.register("email")}
            error={Boolean(methods.formState.errors.email)}
            helperText={methods.formState.errors.email?.message}
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
                  <IconButton
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
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
        >
          Sign Up
        </Button>
      </Box>
    </FormProvider>
  );
};

export default Register;
