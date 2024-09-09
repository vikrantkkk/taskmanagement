import React, { useState, useEffect } from "react";
import {
  Button,
  IconButton,
  Badge,
  Popover,
  MenuItem,
  MenuList,
  ListItemText,
  ListItem,
} from "@mui/material";
import { Notifications, AccountCircle } from "@mui/icons-material";
import CreateTaskDialog from "./CreateTaskDialog";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client"; // Import socket.io-client

const socket = io("http://localhost:5000"); // Connect to your backend socket

const Header = () => {
  const [openCreateTaskDialog, setOpenCreateTaskDialog] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [profileMenuAnchorEl, setProfileMenuAnchorEl] = useState(null);
  const navigate = useNavigate();

  // Open the "Create Task" dialog
  const handleOpenCreateTaskDialog = () => {
    setOpenCreateTaskDialog(true);
  };

  // Close the "Create Task" dialog
  const handleCloseCreateTaskDialog = () => {
    setOpenCreateTaskDialog(false);
  };

  // Open the profile menu
  const handleOpenProfileMenu = (event) => {
    setProfileMenuAnchorEl(event.currentTarget);
  };

  // Close the profile menu
  const handleCloseProfileMenu = () => {
    setProfileMenuAnchorEl(null);
  };

  // Open the notifications popover
  const handleNotificationClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Close the notifications popover
  const handleCloseNotificationMenu = () => {
    setAnchorEl(null);
  };

  // Mark a notification as read
  const markAsRead = (index) => {
    const updatedNotifications = [...notifications];
    updatedNotifications.splice(index, 1);
    setNotifications(updatedNotifications);
    setNotificationsCount(updatedNotifications.length);
    handleCloseNotificationMenu();
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/user/logout`);
      localStorage.removeItem("token");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Listen for task notifications via socket.io
  useEffect(() => {
    socket.on("newTaskNotification", (notification) => {
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        notification,
      ]);
      setNotificationsCount((prevCount) => prevCount + 1);
    });

    return () => {
      socket.off("newTaskNotification"); // Clean up on unmount
    };
  }, []);

  return (
    <header className="p-4 flex items-center justify-between shadow-lg">
      <h1 className="text-2xl font-bold">Task Manager</h1>

      <div className="flex items-center space-x-4">
        <Button
          variant="contained"
          onClick={handleOpenCreateTaskDialog}
          sx={{
            backgroundColor: "#673AB7",
            "&:hover": {
              backgroundColor: "#5e35b1",
            },
          }}
        >
          Create Task
        </Button>

        {/* Notifications Icon with Badge */}
        <IconButton sx={{ color: "gray" }} onClick={handleNotificationClick}>
          <Badge badgeContent={notificationsCount} color="error">
            <Notifications fontSize="large" />
          </Badge>
        </IconButton>

        <IconButton sx={{ color: "gray" }} onClick={handleOpenProfileMenu}>
          <AccountCircle fontSize="large" />
        </IconButton>
      </div>

      <CreateTaskDialog
        open={openCreateTaskDialog}
        handleClose={handleCloseCreateTaskDialog}
      />

      {/* Notifications Popover */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleCloseNotificationMenu}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <MenuList>
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <MenuItem key={index} onClick={() => markAsRead(index)}>
                <ListItemText
                  primary={notification.message}
                  secondary={new Date(notification.timestamp).toLocaleString()}
                />
              </MenuItem>
            ))
          ) : (
            <MenuItem>
              <ListItemText primary="No new notifications" />
            </MenuItem>
          )}
        </MenuList>
      </Popover>

      {/* Profile Popover */}
      <Popover
        open={Boolean(profileMenuAnchorEl)}
        anchorEl={profileMenuAnchorEl}
        onClose={handleCloseProfileMenu}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        sx={{ marginTop: 1 }}
      >
        <div className="p-2">
          <MenuList>
            <MenuItem onClick={() => navigate("/dashboard/setting")}>
              Profile
            </MenuItem>
            <MenuItem onClick={() => navigate("/dashboard/setting")}>
              Settings
            </MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </MenuList>
        </div>
      </Popover>
    </header>
  );
};

export default Header;
