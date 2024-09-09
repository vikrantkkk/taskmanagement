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
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
} from "@mui/material";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import axios from "axios";
import EditTaskDialog from "./EditTaskModal";
import DeleteTaskDialog from "./DeleteTaskModal";
import moment from "moment";
import { useSnackbar } from "notistack";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
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
  const [anchorEl, setAnchorEl] = useState(null); // for menu
  const [selectedPriority, setSelectedPriority] = useState(""); // for priority filter
  const { enqueueSnackbar } = useSnackbar();
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId"); // Assume user ID is stored in localStorage

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/task/get-user-task`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTasks(data.data);
        setFilteredTasks(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [token]);

  useEffect(() => {
    if (selectedPriority === "") {
      setFilteredTasks(tasks);
    } else {
      setFilteredTasks(
        tasks.filter(
          (task) =>
            task.priority.toLowerCase() === selectedPriority.toLowerCase()
        )
      );
    }
  }, [selectedPriority, tasks]);

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
    setAnchorEl(null); // Close the menu when editing
  };

  const openDeleteDialog = (task) => {
    setSelectedTask(task);
    setDeleteDialogOpen(true);
    setAnchorEl(null); // Close the menu when deleting
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

  // Menu handlers
  const handleMenuClick = (event, task) => {
    setSelectedTask(task);
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="">
      <Box sx={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
        <FormControl
          fullWidth
          margin="normal"
          sx={{ width: "10rem"}}
        >
          <InputLabel id="priority-filter-label">Filter by Priority</InputLabel>
          <Select
            labelId="priority-filter-label"
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            label="Filter by Priority"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="high">High</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="low">Low</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <CircularProgress />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredTasks.map((task) => (
            <Card
              key={task._id}
              className="relative shadow-lg rounded-lg bg-white flex flex-col border border-gray-200"
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
                  variant="h6"
                  component="div"
                  gutterBottom
                  fontWeight="bold"
                  color="text.primary"
                >
                  {task.title}
                </Typography>

                <Chip
                  icon={<PriorityHighIcon />}
                  label={`Priority: ${task.priority}`}
                  color={getPriorityColor(task.priority)}
                  className="my-2"
                />

                <Typography
                  variant="body2"
                  color="text.secondary"
                  gutterBottom
                  fontStyle="italic"
                >
                  Status: {task.status}
                </Typography>

                {task.assignedTo?._id !== userId && (
                  <Typography
                    variant="body2"
                    color="text.primary"
                    className="mt-2"
                  >
                    Assigned By: {task.assignedBy?.name || ""}
                  </Typography>
                )}

                <Box
                  my={2}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <LinearProgress
                    variant="determinate"
                    value={getProgress(task.status)}
                    color={task.status === "completed" ? "success" : "primary"}
                    style={{
                      flexGrow: 1,
                      marginRight: "5px",
                      height: 10,
                      borderRadius: "10px",
                    }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {getProgress(task.status)}%
                  </Typography>
                </Box>

                <Collapse
                  in={expandedTaskId === task._id}
                  timeout="auto"
                  unmountOnExit
                >
                  <Typography variant="body2" paragraph color="text.primary">
                    {task.description}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Created On:{" "}
                    {moment(task.createdAt).format("MMMM Do YYYY, h:mm:ss a")}
                  </Typography>
                </Collapse>
              </CardContent>

              <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center">
                <IconButton onClick={() => handleExpandClick(task._id)}>
                  {expandedTaskId === task._id ? (
                    <ExpandLessIcon />
                  ) : (
                    <ExpandMoreIcon />
                  )}
                </IconButton>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Task Dialog */}
      {selectedTask && (
        <EditTaskDialog
          open={editDialogOpen}
          handleClose={() => setEditDialogOpen(false)}
          handleSubmit={handleEditSubmit}
          formData={formData}
          setFormData={setFormData}
        />
      )}

      {/* Delete Task Dialog */}
      {selectedTask && (
        <DeleteTaskDialog
          open={deleteDialogOpen}
          handleClose={() => setDeleteDialogOpen(false)}
          handleDelete={handleDelete}
        />
      )}

      {/* Menu for Edit and Delete options */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => openEditDialog(selectedTask)}>Edit</MenuItem>
        <MenuItem onClick={() => openDeleteDialog(selectedTask)}>
          Delete
        </MenuItem>
      </Menu> 
    </div>
  );
};

export default TaskList;
