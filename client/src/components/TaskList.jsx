import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Typography,
  Chip,
  Menu,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  TextField,
  Autocomplete,
  Divider,
  Box,
  Grid,
  InputAdornment,
} from "@mui/material";
import { MoreVert, PriorityHigh, LowPriority } from "@mui/icons-material";

const statusColors = {
  "To Do": "#b0bec5", // Light Gray
  "In Progress": "#ff9800", // Orange
  Done: "#4caf50", // Green
};

const priorityIcons = {
  High: <PriorityHigh color="error" />,
  Medium: <PriorityHigh color="warning" />,
  Low: <LowPriority color="action" />,
};

const taskStatuses = ["To Do", "In Progress", "Done"];
const priorities = ["High", "Medium", "Low"];

const TaskCard = ({
  title,
  description,
  status,
  priority,
  owner,
  assignee,
  assignees,
  onEdit,
  onDelete,
  onAssigneeChange,
  onStatusChange,
  onPriorityChange,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(status);
  const [selectedPriority, setSelectedPriority] = useState(priority);
  const [selectedAssignee, setSelectedAssignee] = useState(assignee);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
    onStatusChange(event.target.value);
  };

  const handlePriorityChange = (event) => {
    setSelectedPriority(event.target.value);
    onPriorityChange(event.target.value);
  };

  const handleAssigneeChange = (event, newValue) => {
    setSelectedAssignee(newValue);
    onAssigneeChange(newValue);
  };

  return (
    <Card
      sx={{
        mb: 2,
        width: 350,
        boxShadow: 3,
        borderRadius: 1,
        overflow: "visible",
        mx: 1,
      }}
    >
      <CardHeader
        title={
          <Typography variant="h6" color="text.primary" fontWeight="medium">
            {title}
          </Typography>
        }
        subheader={
          <Chip
            label={selectedStatus}
            sx={{
              backgroundColor: statusColors[selectedStatus],
              color: "white",
              fontWeight: "medium",
            }}
          />
        }
        action={
          <div>
            <IconButton aria-label="more" onClick={handleMenuOpen}>
              <MoreVert />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem
                onClick={() => {
                  onEdit();
                  handleMenuClose();
                }}
              >
                Edit
              </MenuItem>
              <MenuItem
                onClick={() => {
                  onDelete();
                  handleMenuClose();
                }}
              >
                Delete
              </MenuItem>
            </Menu>
          </div>
        }
        sx={{ backgroundColor: "rgba(0,0,0,0.05)" }}
      />
      <CardContent sx={{ padding: 2 }}>
        <Typography variant="body2" color="text.secondary" paragraph>
          {description}
        </Typography>
        <Typography
          variant="body2"
          color="text.primary"
          mt={1}
          fontWeight="medium"
        >
          Created by: {owner}
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Box display="flex" alignItems="center" mb={2}>
          <Box display="flex" alignItems="center">
            {priorityIcons[selectedPriority]}
            <Typography
              variant="body2"
              color="text.secondary"
              ml={1}
              fontWeight="medium"
            >
              Priority:
            </Typography>
            <Select
              value={selectedPriority}
              onChange={handlePriorityChange}
              sx={{ ml: 1, width: 120 }}
              variant="outlined"
            >
              {priorities.map((priority) => (
                <MenuItem key={priority} value={priority}>
                  {priority}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Box>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={selectedStatus}
            onChange={handleStatusChange}
            label="Status"
            variant="outlined"
          >
            {taskStatuses.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <Autocomplete
            value={selectedAssignee}
            onChange={handleAssigneeChange}
            options={assignees}
            getOptionLabel={(option) => option}
            renderInput={(params) => (
              <TextField {...params} label="Assignee" variant="outlined" />
            )}
          />
        </FormControl>
      </CardContent>
    </Card>
  );
};

const TaskList = () => {
  const [assignees] = useState(["John Doe", "Jane Smith", "Alice Johnson"]);

  const [filterStatus, setFilterStatus] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [filterAssignee, setFilterAssignee] = useState("");

  const tasks = [
    {
      _id: "1",
      title: "Design Dashboard",
      description: "Create a user-friendly dashboard layout.",
      status: "In Progress",
      priority: "High",
      owner: "John Doe",
      assignee: "Jane Smith",
    },
    {
      _id: "2",
      title: "Develop Authentication",
      description: "Implement login and registration features.",
      status: "To Do",
      priority: "Medium",
      owner: "Jane Smith",
      assignee: "Alice Johnson",
    },
    {
      _id: "3",
      title: "Fix Bugs",
      description: "Resolve issues reported by users.",
      status: "Done",
      priority: "Low",
      owner: "Alice Johnson",
      assignee: "John Doe",
    },
  ];

  const filteredTasks = tasks.filter((task) => {
    return (
      (filterStatus ? task.status === filterStatus : true) &&
      (filterPriority ? task.priority === filterPriority : true) &&
      (filterAssignee ? task.assignee === filterAssignee : true)
    );
  });

  const handleEdit = (taskId) => {
    console.log("Edit task with ID:", taskId);
  };

  const handleDelete = (taskId) => {
    console.log("Delete task with ID:", taskId);
  };

  const handleAssigneeChange = (taskId, newAssignee) => {
    console.log("Assign task with ID:", taskId, "to", newAssignee);
  };

  const handleStatusChange = (taskId, newStatus) => {
    console.log("Change status of task with ID:", taskId, "to", newStatus);
  };

  const handlePriorityChange = (taskId, newPriority) => {
    console.log("Change priority of task with ID:", taskId, "to", newPriority);
  };

  const getTasksByStatus = (status) =>
    filteredTasks.filter((task) => task.status === status);

  return (
    <Box p={2}>
      <Box display="flex" flexDirection="row" justifyContent="flex-end">
          <FormControl sx={{ minWidth: 120, mr: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              label="Status"
            >
              <MenuItem value="">All</MenuItem>
              {taskStatuses.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Priority</InputLabel>
            <Select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              label="Priority"
            >
              <MenuItem value="">All</MenuItem>
              {priorities.map((priority) => (
                <MenuItem key={priority} value={priority}>
                  {priority}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
      </Box>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        flexWrap="wrap"
      >
        {taskStatuses.map((status) => (
          <Box key={status} sx={{ flex: 1, mr: 1 }}>
            <Typography variant="h6" fontWeight="medium" mb={1}>
              {status}
            </Typography>
            <Grid container spacing={2}>
              {getTasksByStatus(status).map((task) => (
                <Grid item xs={12} key={task._id}>
                  <TaskCard
                    title={task.title}
                    description={task.description}
                    status={task.status}
                    priority={task.priority}
                    owner={task.owner}
                    assignee={task.assignee}
                    assignees={assignees}
                    onEdit={() => handleEdit(task._id)}
                    onDelete={() => handleDelete(task._id)}
                    onAssigneeChange={(newAssignee) =>
                      handleAssigneeChange(task._id, newAssignee)
                    }
                    onStatusChange={(newStatus) =>
                      handleStatusChange(task._id, newStatus)
                    }
                    onPriorityChange={(newPriority) =>
                      handlePriorityChange(task._id, newPriority)
                    }
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default TaskList;
