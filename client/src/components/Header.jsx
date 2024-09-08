import React, { useState } from 'react';
import { Button, IconButton, Badge, Popover, MenuItem, MenuList } from '@mui/material';
import { Notifications, AccountCircle } from '@mui/icons-material';
import CreateTaskDialog from './CreateTaskDialog';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios or use your preferred method for API calls

const Header = () => {
  const [openCreateTaskDialog, setOpenCreateTaskDialog] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [profileMenuAnchorEl, setProfileMenuAnchorEl] = useState(null);
  const navigate = useNavigate();

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
      localStorage.removeItem('token');
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="p-4 flex items-center justify-between bg-blue-600 text-white">
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

        <IconButton sx={{ color: "white" }} onClick={handleNotificationClick}>
          <Badge badgeContent={notificationsCount} color="error">
            <Notifications fontSize="large" />
          </Badge>
        </IconButton>

        <IconButton sx={{ color: "white" }} onClick={handleOpenProfileMenu}>
          <AccountCircle fontSize="large" />
        </IconButton>
      </div>

      <CreateTaskDialog open={openCreateTaskDialog} handleClose={handleCloseCreateTaskDialog} />

      <Popover
        open={Boolean(profileMenuAnchorEl)}
        anchorEl={profileMenuAnchorEl}
        onClose={handleCloseProfileMenu}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        sx={{ marginTop: 1 }}
      >
        <div className="p-2">
          <MenuList>
            <MenuItem onClick={() => navigate("/dashboard/setting")}>Profile</MenuItem>
            <MenuItem onClick={() => navigate("/dashboard/setting")}>Settings</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </MenuList>
        </div>
      </Popover>
    </header>
  );
};

export default Header;
