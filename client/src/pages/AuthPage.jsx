import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import SingleStoreIcon from "../assets/icons/SingleStoreIcon";
import Register from "../components/Register";
import Login from "../components/Login";

const AuthPage = () => {
  const [isRegister, setIsRegister] = useState(false);

  return (
    <Box className="min-h-screen bg-slate-200 flex items-center justify-center">
      <Box className="w-1/3 bg-white p-4 rounded-lg flex gap-4 flex-col items-center shadow-lg">
        <Box className="flex justify-center items-center gap-2">
          <SingleStoreIcon />
          <Box className="font-bold text-2xl">TaskPro</Box>
        </Box>
        <Box className="text-[#673AB7] font-bold text-2xl">
          Hi, Welcome Back
        </Box>
        <Box className="text-lg text-gray-400">
          {isRegister
            ? "Register to create a new account"
            : "Enter your credentials to continue"}
        </Box>

        {/* Conditional rendering of either the Login or Register component */}
        {isRegister ? <Register /> : <Login />}

        <Button
          onClick={() => setIsRegister(!isRegister)}
          color="secondary"
        >
          {isRegister ? "Already have an account? Sign In" : "Create an account"}
        </Button>
      </Box>
    </Box>
  );
};

export default AuthPage;
