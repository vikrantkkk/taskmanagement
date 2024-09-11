import React, { useState, useEffect } from "react";
import {
  Button,
  IconButton,
  Badge,
  Popover,
  MenuItem,
  MenuList,
  ListItemText,
  Typography,
  Divider,
  Avatar,
} from "@mui/material";
import {
  Notifications,
  AccountCircle,
  Person2Outlined,
} from "@mui/icons-material";
import CreateTaskDialog from "./CreateTaskDialog";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client"; 
import { useSelector } from "react-redux";
import TemporaryDrawer from "./TemporaryDrawer";

const socket = io("http://localhost:5000");

const Header = () => {
  const [openCreateTaskDialog, setOpenCreateTaskDialog] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [profileMenuAnchorEl, setProfileMenuAnchorEl] = useState(null);
  const navigate = useNavigate();

  const res = useSelector((state) => state.auth.user);


  const handleOpenCreateTaskDialog = () => {
    setOpenCreateTaskDialog(true);
  };

 
  const handleCloseCreateTaskDialog = () => {
    setOpenCreateTaskDialog(false);
  };


  const handleOpenProfileMenu = (event) => {
    setProfileMenuAnchorEl(event.currentTarget);
  };


  const handleCloseProfileMenu = () => {
    setProfileMenuAnchorEl(null);
  };

 
  const handleNotificationClick = (event) => {
    setAnchorEl(event.currentTarget);
  };


  const handleCloseNotificationMenu = () => {
    setAnchorEl(null);
  };

 
  const markAsRead = (index) => {
    const updatedNotifications = [...notifications];
    updatedNotifications.splice(index, 1);
    setNotifications(updatedNotifications);
    setNotificationsCount(updatedNotifications.length);
    handleCloseNotificationMenu();
  };


  const handleLogout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/user/logout`);
      localStorage.clear();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

 
  useEffect(() => {
    socket.on("newTaskNotification", (notification) => {
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        notification,
      ]);
      setNotificationsCount((prevCount) => prevCount + 1);
    });

    return () => {
      socket.off("newTaskNotification"); 
    };
  }, []);

  return (
    <header className="p-4 flex items-center justify-between shadow-lg">
      <div className="md:hidden block">
        <TemporaryDrawer />
      </div>
      <h1 className="text-2xl font-bold md:block hidden">Task Manager</h1>

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

        <Avatar
          onClick={handleOpenProfileMenu}
          alt={res?.name || "User"}
          src={res?.profilePic || res?.user?.profilePic}
          sx={{ cursor: "pointer", width: 40, height: 40 }}
        >
          {!res && <AccountCircle fontSize="inherit" />}
        </Avatar>
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
            <Typography color="gray" mb={1}>
              {" "}
              <Person2Outlined /> {res?.user?.name || res?.name}
            </Typography>
            <Divider />
            <MenuItem onClick={() => navigate("/dashboard/my-account")}>
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
