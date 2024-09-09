import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import SingleStoreIcon from "../assets/icons/SingleStoreIcon";
import Register from "../components/Register";
import Login from "../components/Login";

const AuthPage = () => {
  const [isRegister, setIsRegister] = useState(false);

  return (
    <Box className="min-h-screen p-4 sm:p-8 bg-slate-200 flex items-center justify-center">
      <Box className="w-full max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl bg-white p-4 sm:p-8 rounded-lg flex gap-4 flex-col items-center shadow-lg">
        <Box className="flex justify-center items-center gap-2">
          <SingleStoreIcon />
          <Box className="font-bold text-xl sm:text-2xl">TaskPro</Box>
        </Box>
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
