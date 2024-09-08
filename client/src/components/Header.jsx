import React, { useState } from "react";
import { Button, IconButton, Badge } from "@mui/material";
import { Notifications, AccountCircle } from "@mui/icons-material"; // Importing icons
import CreateTaskDialog from "./CreateTaskDialog";

const Header = () => {
  const [openDialog, setOpenDialog] = useState(false); // State to control the dialog
  const [notificationsCount, setNotificationsCount] = useState(3); // Example notification count

  // Function to open the dialog
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  // Function to close the dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <header className="flex items-center justify-between px-8 py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 shadow-lg">
      <h1 className="text-white text-2xl font-bold">Task Manager</h1>

      <div className="flex items-center space-x-4">
        {/* Create Task Button */}
        <Button
          variant="contained"
          onClick={handleOpenDialog} // Trigger opening the dialog
          sx={{
            backgroundColor: 'linear-gradient(45deg, #FFA726, #FB8C00)',
            color: 'white',
            '&:hover': {
              backgroundColor: 'linear-gradient(45deg, #FF9800, #F57C00)',
              boxShadow: '0 4px 10px rgba(255, 152, 0, 0.7)',
            },
            textTransform: 'none',
            padding: '12px 24px',
            fontSize: '18px',
            fontWeight: 'bold',
            borderRadius: '30px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
            transition: 'all 0.3s ease',
          }}
        >
          Create Task
        </Button>

        {/* Notification Icon */}
        <IconButton sx={{ color: 'white' }}>
          <Badge badgeContent={notificationsCount} color="error">
            <Notifications fontSize="large" />
          </Badge>
        </IconButton>

        {/* Profile Icon */}
        <IconButton sx={{ color: 'white' }}>
          <AccountCircle fontSize="large" />
        </IconButton>
      </div>

      {/* Create Task Dialog */}
      <CreateTaskDialog open={openDialog} handleClose={handleCloseDialog} />
    </header>
  );
};

export default Header;
