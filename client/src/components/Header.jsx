import React, { useState, useEffect } from "react";
import { Button, IconButton, Badge } from "@mui/material";
import { Notifications, AccountCircle } from "@mui/icons-material";
import CreateTaskDialog from "./CreateTaskDialog";
import NotificationMenu from "./NotificationMenu";
import io from "socket.io-client"; // Import Socket.io client

const Header = () => {
  const [openDialog, setOpenDialog] = useState(false); // Dialog state
  const [notifications, setNotifications] = useState([]); // List of notifications
  const [notificationsCount, setNotificationsCount] = useState(0); // Notification count
  const [anchorEl, setAnchorEl] = useState(null); // For notification menu

  useEffect(() => {
    // Connect to Socket.io server
    const socket = io("http://localhost:3000"); // Ensure this matches your backend URL

    // Listen for incoming notifications from the server
    socket.on("receiveNotification", (notification) => {
      console.log("Notification received:", notification); // For debugging
      setNotifications((prev) => [...prev, notification]);
      setNotificationsCount((prev) => prev + 1);
    });

    // Cleanup socket connection
    return () => {
      socket.disconnect();
    };
  }, []);

  // Function to open the dialog
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  // Function to close the dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Function to handle notification menu opening
  const handleNotificationClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Function to close the notification menu
  const handleCloseNotificationMenu = () => {
    setAnchorEl(null);
  };

  // Mark notification as read
  const markAsRead = (index) => {
    const updatedNotifications = [...notifications];
    updatedNotifications.splice(index, 1);
    setNotifications(updatedNotifications);
    setNotificationsCount(updatedNotifications.length);
    handleCloseNotificationMenu();
  };

  return (
    <header className="p-4 flex items-center justify-between">
      <h1 className="text-white text-2xl font-bold">Task Manager</h1>

      <div className="flex items-center space-x-4">
        {/* Create Task Button */}
        <Button
          variant="contained"
          onClick={handleOpenDialog}
          sx={{
            backgroundColor: "#673AB7",
            "&:hover": {
              backgroundColor: "#5e35b1",
            },
          }}
        >
          Create Task
        </Button>

        {/* Notification Icon */}
        <IconButton sx={{ color: "gray" }} onClick={handleNotificationClick}>
          <Badge badgeContent={notificationsCount} color="error">
            <Notifications fontSize="large" />
          </Badge>
        </IconButton>

        {/* Profile Icon */}
        <IconButton sx={{ color: "gray" }}>
          <AccountCircle fontSize="large" />
        </IconButton>
      </div>

      {/* Notification Menu */}
      <NotificationMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseNotificationMenu}
        notifications={notifications}
        markAsRead={markAsRead}
      />

      {/* Create Task Dialog */}
      <CreateTaskDialog open={openDialog} handleClose={handleCloseDialog} />
    </header>
  );
};

export default Header;
