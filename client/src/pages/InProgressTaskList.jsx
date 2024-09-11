import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Box,
  Chip,
  IconButton,
  Collapse,
  Menu,
  MenuItem,
} from "@mui/material";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import axios from "axios";
import moment from "moment"; 
import { useSnackbar } from "notistack";
import EditTaskDialog from "../components/EditTaskModal";
import DeleteTaskDialog from "../components/DeleteTaskModal";

const InProgressTaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "",
    priority: "",
    assignedTo: "",
  });
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null); 
  const { enqueueSnackbar } = useSnackbar();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/task/get-user-task`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTasks(data.data.filter(task => task.status.toLowerCase() === "inprogress"));
      } catch (err) {
        console.error(err);
      }
    };

    fetchTasks();
  }, [token]);

  const getProgress = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return 0;
      case "inprogress":
        return 50;
      case "completed":
        return 100;
      default:
        return 0;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "error";
      case "medium":
        return "warning";
      case "low":
        return "success";
      default:
        return "default";
    }
  };

  const handleExpandClick = (taskId) => {
    setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
  };

  const openEditDialog = (task) => {
    setSelectedTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      assignedTo: task.assignedTo?._id || "",
    });
    setEditDialogOpen(true);
    setAnchorEl(null); 
  };

  const openDeleteDialog = (task) => {
    setSelectedTask(task);
    setDeleteDialogOpen(true);
    setAnchorEl(null); 
  };

  const handleEditSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/task/update-task/${
          selectedTask._id
        }`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      enqueueSnackbar(response?.data?.message, { variant: "success" });
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === selectedTask._id ? { ...task, ...formData } : task
        )
      );
      setEditDialogOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/task/delete-task/${
          selectedTask._id
        }`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      enqueueSnackbar(response?.data?.message, { variant: "success" });
      setTasks((prevTasks) =>
        prevTasks.filter((task) => task._id !== selectedTask._id)
      );
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(
        error.response?.data?.message ||
          "An error occurred while deleting the task.",
        { variant: "error" }
      );
    } finally {
      setLoading(false);
    }
  };

  
  const handleMenuClick = (event, task) => {
    setSelectedTask(task);
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
      {tasks.map((task) => (
        <Card
          key={task._id}
          className="relative shadow-lg rounded-lg bg-gray-50 flex flex-col"
        >
          <CardContent className="flex-1 p-4">
            <div className="absolute top-2 right-2">
              <IconButton
                size="small"
                onClick={(event) => handleMenuClick(event, task)}
              >
                <MoreVertIcon />
              </IconButton>
            </div>

            <Typography
              variant="h5"
              component="div"
              gutterBottom
              fontWeight="bold"
            >
              {task.title}
            </Typography>

            <Chip
              icon={<PriorityHighIcon />}
              label={`Priority: ${task.priority}`}
              color={getPriorityColor(task.priority)}
              className="my-2 font-bold"
            />

            <Typography
              variant="body2"
              color="text.secondary"
              gutterBottom
              fontStyle="italic"
            >
              Status: {task.status}
            </Typography>

            <Box
              my={2}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <LinearProgress
                variant="determinate"
                value={getProgress(task.status)}
                color={task.status === "complete" ? "success" : "primary"}
                style={{
                  flexGrow: 1,
                  marginRight: "5px",
                  height: 10,
                  borderRadius: "10px",
                }}
              />
              <Typography variant="body2">
                {getProgress(task.status)}%
              </Typography>
            </Box>

            <Collapse
              in={expandedTaskId === task._id}
              timeout="auto"
              unmountOnExit
            >
              <Typography variant="body2" paragraph>
                {task.description}
              </Typography>

              <Typography variant="body2" color="textSecondary">
                Created On:{" "}
                {moment(task.createdAt).format("MMMM Do YYYY, h:mm:ss a")}
              </Typography>
            </Collapse>

            <IconButton
              size="small"
              onClick={() => handleExpandClick(task._id)}
              className="absolute bottom-2 right-2"
            >
              {expandedTaskId === task._id ? (
                <ExpandLessIcon />
              ) : (
                <ExpandMoreIcon />
              )}
            </IconButton>
          </CardContent>

     
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => openEditDialog(selectedTask)}>
              Edit
            </MenuItem>
            <MenuItem onClick={() => openDeleteDialog(selectedTask)}>
              Delete
            </MenuItem>
          </Menu>
        </Card>
      ))}

      <EditTaskDialog
        open={editDialogOpen}
        handleClose={() => setEditDialogOpen(false)}
        formData={formData}
        setFormData={setFormData}
        handleEditSubmit={handleEditSubmit}
        loading={loading}
      />


      <DeleteTaskDialog
        open={deleteDialogOpen}
        handleClose={() => setDeleteDialogOpen(false)}
        selectedTask={selectedTask}
        handleDelete={handleDelete}
        loading={loading}
      />
    </div>
  );
};

export default InProgressTaskList;
