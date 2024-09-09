import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import SingleStoreIcon from "../assets/icons/SingleStoreIcon";
import Register from "../components/Register";
import Login from "../components/Login";

const AuthPage = () => {
  const [isRegister, setIsRegister] = useState(false);

  return (
    <Box className="min-h-screen p-4 sm:p-8 flex items-center justify-center relative overflow-hidden bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">

      <Box className="absolute w-64 h-64 rounded-full bg-white opacity-20 animate-spin-slow top-1/4 left-1/4"></Box>
      <Box className="absolute w-96 h-96 rounded-full bg-white opacity-10 animate-spin-slow top-2/4 right-1/4"></Box>

      <Box className="absolute top-4 left-4 flex items-center gap-2">
        <SingleStoreIcon />
        <Box className="font-bold text-lg sm:text-xl text-white">TaskPro</Box>
      </Box>

      <Box className="relative mt-8  w-full max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl bg-white p-4 sm:p-8 rounded-lg flex gap-4 flex-col items-center shadow-lg z-10">
        <Box className="text-[#673AB7] font-bold text-lg sm:text-2xl text-center">
          Hi, Welcome Back
        </Box>
        <Box className="text-md sm:text-lg text-gray-400 text-center">
          {isRegister
            ? "Register to create a new account"
            : "Enter your credentials to continue"}
        </Box>
        <Box className="w-full">{isRegister ? <Register /> : <Login />}</Box>
        <Button
          onClick={() => setIsRegister(!isRegister)}
          color="secondary"
          className="w-full"
        >
          {isRegister
            ? "Already have an account? Sign In"
            : "Create an account"}
        </Button>
      </Box>
    </Box>
  );
};

export default AuthPage;
