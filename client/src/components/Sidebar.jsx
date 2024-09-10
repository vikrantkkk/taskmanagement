import { Link, useLocation } from "react-router-dom";
import {
  Dashboard,
  ListAlt,
  HourglassEmpty,
  CheckCircle,
  Settings,
  PendingActions,
} from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import SingleStoreIcon from "../assets/icons/SingleStoreIcon"; // Update this path if needed

const Sidebar = () => {
  const location = useLocation(); // Get current route path

  // Define active link background color and hover states
  const activeClassName = "bg-blue-700 text-white"; // Active background color
  const inactiveClassName = "hover:bg-blue-600"; // Hover color for inactive links

  return (
    <aside className="w-64 bg-gray-900 text-white h-screen p-4 shadow-lg flex flex-col">
      {/* Logo and Title */}
      <Box className="flex items-center gap-2 mb-6 p-4 bg-gray-800 rounded-lg">
        <SingleStoreIcon className="w-10 h-10" /> {/* Adjust the size as needed */}
        <Typography variant="h5" className="font-bold text-white">
          TaskPro
        </Typography>
      </Box>

      {/* Navigation Links */}
      <nav className="flex-1">
        <ul className="space-y-4">
          {/* Dashboard */}
          <li className="flex items-center rounded-lg p-2">
            <Link
              to="/dashboard"
              className={`flex items-center space-x-3 w-full h-full rounded-lg p-2 ${location.pathname === "/dashboard" ? activeClassName : inactiveClassName}`}
            >
              <Dashboard fontSize="small" />
              <Typography>Dashboard</Typography>
            </Link>
          </li>

          {/* All Tasks */}
          <li className="flex items-center rounded-lg p-2">
            <Link
              to="/dashboard/tasks"
              className={`flex items-center space-x-3 w-full h-full rounded-lg p-2 ${location.pathname === "/dashboard/tasks" ? activeClassName : inactiveClassName}`}
            >
              <ListAlt fontSize="small" />
              <Typography>All Tasks</Typography>
            </Link>
          </li>

          {/* Completed */}
          <li className="flex items-center rounded-lg p-2">
            <Link
              to="/dashboard/completed-task"
              className={`flex items-center space-x-3 w-full h-full rounded-lg p-2 ${location.pathname === "/dashboard/completed-task" ? activeClassName : inactiveClassName}`}
            >
              <CheckCircle fontSize="small" />
              <Typography>Completed Task</Typography>
            </Link>
          </li>


          {/* In Progress */}
          <li className="flex items-center rounded-lg p-2">
            <Link
              to="/dashboard/inprogress-task"
              className={`flex items-center space-x-3 w-full h-full rounded-lg p-2 ${location.pathname === "/dashboard/inprogress-task" ? activeClassName : inactiveClassName}`}
            >
              <HourglassEmpty fontSize="small" />
              <Typography>InProgress Taks</Typography>
            </Link>
          </li>


          {/* In Pending */}
          <li className="flex items-center rounded-lg p-2">
            <Link
              to="/dashboard/pending-task"
              className={`flex items-center space-x-3 w-full h-full rounded-lg p-2 ${location.pathname === "/dashboard/pending-task" ? activeClassName : inactiveClassName}`}
            >
               <PendingActions fontSize="small" />
              <Typography>Pending task</Typography>
            </Link>
          </li>
          
          {/* Settings */}
          <li className="flex items-center rounded-lg p-2">
            <Link
              to="/dashboard/setting"
              className={`flex items-center space-x-3 w-full h-full rounded-lg p-2 ${location.pathname === "/dashboard/setting" ? activeClassName : inactiveClassName}`}
            >
              <Settings fontSize="small" />
              <Typography>Settings</Typography>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
