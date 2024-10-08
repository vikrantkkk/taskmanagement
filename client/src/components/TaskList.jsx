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
  Tooltip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import axios from "axios";
import EditTaskDialog from "./EditTaskModal";
import DeleteTaskDialog from "./DeleteTaskModal";
import moment from "moment";
import { useSnackbar } from "notistack";
import { useGetUserTasksQuery } from "../redux/api/taskApi";
import { setUserTasks } from "../redux/taskSlice";
import { useDispatch } from "react-redux";

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
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPriority, setSelectedPriority] = useState("");
  const [selectedSortOrder, setSelectedSortOrder] = useState("newest");
  const { enqueueSnackbar } = useSnackbar();
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();

  const { data, isLoading, refetch } = useGetUserTasksQuery();

  useEffect(() => {
    const fetchTasks = async () => {
      if (data) {
        const res = await dispatch(setUserTasks(data?.data));
        setTasks(res?.payload);
        setFilteredTasks(res?.payload);
      }
    };

    fetchTasks();
  }, [data, dispatch]);

  useEffect(() => {
    let sortedTasks = [...tasks];

    if (selectedSortOrder === "newest") {
      sortedTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (selectedSortOrder === "oldest") {
      sortedTasks.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    if (selectedPriority === "") {
      setFilteredTasks(sortedTasks);
    } else {
      setFilteredTasks(
        sortedTasks.filter(
          (task) =>
            task.priority.toLowerCase() === selectedPriority.toLowerCase()
        )
      );
    }
  }, [selectedPriority, tasks, selectedSortOrder]);

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

  const getColor = (value, type) => {
    if (type === "priority") {
      switch (value.toLowerCase()) {
        case "high":
          return "error";
        case "medium":
          return "warning";
        case "low":
          return "success";
        default:
          return "default";
      }
    } else if (type === "status") {
      switch (value.toLowerCase()) {
        case "pending":
          return "warning";
        case "inprogress":
          return "info";
        case "completed":
          return "success";
        default:
          return "default";
      }
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
          withCredentials: true,
        }
      );
      enqueueSnackbar(response?.data?.message, { variant: "success" });
      refetch();
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
          withCredentials: true,
        }
      );
      enqueueSnackbar(response?.data?.message, { variant: "success" });
      refetch();
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
    <div className="">
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          alignItems: "center",
        }}
      >
        <FormControl fullWidth margin="normal" sx={{ width: "10rem" }}>
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

        <FormControl fullWidth margin="normal" sx={{ width: "10rem" }}>
          <InputLabel id="sort-filter-label">Sort by</InputLabel>
          <Select
            labelId="sort-filter-label"
            value={selectedSortOrder}
            onChange={(e) => setSelectedSortOrder(e.target.value)}
            label="Sort by"
          >
            <MenuItem value="newest">Newest</MenuItem>
            <MenuItem value="oldest">Oldest</MenuItem>
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
                  label={`Priority: ${task.priority}`}
                  color={getColor(task.priority, "priority")}
                />

                <Chip
                  label={`Status: ${task.status}`}
                  color={getColor(task.status, "status")}
                  className="mx-2"
                />

                <Typography variant="body2" color="text.primary" mt={2}>
                  Owner: {task?.owner?.name}
                </Typography>

                {task.assignedTo && task.assignedTo.length > 0 && (
                  <Typography
                    variant="body2"
                    color="text.primary"
                    className="mt-2"
                  >
                    Assigned To:{" "}
                    {task.assignedTo
                      .map((assignee) => assignee.name)
                      .join(", ")}
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
                      flex: 1,
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
                  {task?.description && (
                    <Tooltip
                      title={task.description} 
                      placement="top" 
                      arrow 
                    >
                      <Typography
                        sx={{
                          maxHeight: "5rem",
                          overflowY: "auto",
                          wordWrap: "break-word",
                          scrollbarWidth: "none",
                          "&::-webkit-scrollbar": {
                            display: "none",
                          },
                        }}
                        variant="body2"
                        gutterBottom
                      >
                        {task?.description}
                      </Typography>
                    </Tooltip>
                  )}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "5px",
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Created On:{" "}
                      {moment(task.createdAt).format("MMMM Do YYYY, h:mm:ss a")}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Due Date:{" "}
                      {moment(task.dueDate).format("MMMM Do YYYY, h:mm:ss a")}
                    </Typography>
                  </Box>
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

      {selectedTask && (
        <EditTaskDialog
          open={editDialogOpen}
          handleClose={() => setEditDialogOpen(false)}
          handleEditSubmit={handleEditSubmit}
          formData={formData}
          setFormData={setFormData}
        />
      )}

      {selectedTask && (
        <DeleteTaskDialog
          open={deleteDialogOpen}
          handleClose={() => setDeleteDialogOpen(false)}
          handleDelete={handleDelete}
        />
      )}

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
      {isLoading && <CircularProgress />}
    </div>
  );
};

export default TaskList;
