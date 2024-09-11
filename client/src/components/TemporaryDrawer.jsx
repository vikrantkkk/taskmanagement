import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Box, Typography, Drawer, IconButton } from "@mui/material";
import { Dashboard, ListAlt, HourglassEmpty, CheckCircle, Settings, PendingActions } from "@mui/icons-material";
import SingleStoreIcon from "../assets/icons/SingleStoreIcon"; // Ensure this path is correct
import axios from "axios";
import { logout } from "../redux/userSlice";
import { useDispatch } from "react-redux";
import MenuIcon from "@mui/icons-material/Menu"; // Import MenuIcon from MUI

const Sidebar = () => {
  const [open, setOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/user/logout`);
      localStorage.clear();
      dispatch(logout());
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const activeClassName = "bg-blue-700 text-white";
  const inactiveClassName = "hover:bg-blue-600";

  const DrawerList = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      className="flex flex-col h-full bg-gray-900 text-white p-2"
    >
      <Box className="flex items-center gap-2 mb-6 p-4  bg-gray-800 rounded-lg">
        <SingleStoreIcon className="w-10 h-10" />
        <Typography variant="h5" className="font-bold text-white">
          TaskPro
        </Typography>
      </Box>
      <nav className="flex-1">
        <ul className="space-y-4">
          <li className="flex items-center rounded-lg p-2">
            <Link
              to="/dashboard"
              className={`flex items-center space-x-3 w-full h-full rounded-lg p-2 ${
                location.pathname === "/dashboard" ? activeClassName : inactiveClassName
              }`}
            >
              <Dashboard fontSize="small" />
              <Typography>Dashboard</Typography>
            </Link>
          </li>
          <li className="flex items-center rounded-lg p-2">
            <Link
              to="/dashboard/tasks"
              className={`flex items-center space-x-3 w-full h-full rounded-lg p-2 ${
                location.pathname === "/dashboard/tasks" ? activeClassName : inactiveClassName
              }`}
            >
              <ListAlt fontSize="small" />
              <Typography>All Tasks</Typography>
            </Link>
          </li>
          <li className="flex items-center rounded-lg p-2">
            <Link
              to="/dashboard/completed-task"
              className={`flex items-center space-x-3 w-full h-full rounded-lg p-2 ${
                location.pathname === "/dashboard/completed-task" ? activeClassName : inactiveClassName
              }`}
            >
              <CheckCircle fontSize="small" />
              <Typography>Completed Task</Typography>
            </Link>
          </li>
          <li className="flex items-center rounded-lg p-2">
            <Link
              to="/dashboard/inprogress-task"
              className={`flex items-center space-x-3 w-full h-full rounded-lg p-2 ${
                location.pathname === "/dashboard/inprogress-task" ? activeClassName : inactiveClassName
              }`}
            >
              <HourglassEmpty fontSize="small" />
              <Typography>InProgress Task</Typography>
            </Link>
          </li>
          <li className="flex items-center rounded-lg p-2">
            <Link
              to="/dashboard/pending-task"
              className={`flex items-center space-x-3 w-full h-full rounded-lg p-2 ${
                location.pathname === "/dashboard/pending-task" ? activeClassName : inactiveClassName
              }`}
            >
              <PendingActions fontSize="small" />
              <Typography>Pending Task</Typography>
            </Link>
          </li>
          <li className="flex items-center rounded-lg p-2">
            <Link
              to="/dashboard/setting"
              className={`flex items-center space-x-3 w-full h-full rounded-lg p-2 ${
                location.pathname === "/dashboard/setting" ? activeClassName : inactiveClassName
              }`}
            >
              <Settings fontSize="small" />
              <Typography>Settings</Typography>
            </Link>
          </li>
          <li className="flex items-center rounded-lg p-2">
            <button
              onClick={handleLogout}
              className={`flex items-center space-x-3 w-full h-full rounded-lg p-2 ${inactiveClassName}`}
            >
              <Settings fontSize="small" />
              <Typography>Logout</Typography>
            </button>
          </li>
        </ul>
      </nav>
    </Box>
  );

  return (
    <div>
      <IconButton
        edge="start"
        color="inherit"
        aria-label="menu"
        onClick={toggleDrawer(true)}
        sx={{ margin: 2 }}
      >
        <MenuIcon />
      </IconButton>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
};

export default Sidebar;
