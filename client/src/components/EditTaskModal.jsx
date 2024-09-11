import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  CircularProgress,
} from "@mui/material";

const EditTaskDialog = ({
  open,
  handleClose,
  formData,
  setFormData,
  handleEditSubmit,
  loading,
  assignees,
}) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  return (
    <Dialog open={open} onClose={handleClose} sx={{height:"90%",margin:"4rem 0 0 0"}}>
      <DialogTitle>Edit Task</DialogTitle>
      <DialogContent>
        <TextField
          label="Title"
          name="title"
          fullWidth
          margin="normal"
          value={formData.title}
          onChange={handleInputChange}
        />

        <TextField
          label="Description"
          name="description"
          fullWidth
          margin="normal"
          value={formData.description}
          onChange={handleInputChange}
          multiline
          rows={4}
        />

        <TextField
          label="Status"
          name="status"
          fullWidth
          margin="normal"
          select
          value={formData.status}
          onChange={handleInputChange}
        >
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="inprogress">In Progress</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
        </TextField>

        <TextField
          label="Priority"
          name="priority"
          fullWidth
          margin="normal"
          select
          value={formData.priority}
          onChange={handleInputChange}
        >
          <MenuItem value="low">Low</MenuItem>
          <MenuItem value="medium">Medium</MenuItem>
          <MenuItem value="high">High</MenuItem>
        </TextField>

        <TextField
          label="Assigned To"
          name="assignedTo"
          fullWidth
          margin="normal"
          select
          value={formData.assignedTo || ""}
          onChange={handleInputChange}
          disabled
        >
          {assignees?.map((assignee) => (
            <MenuItem key={assignee._id} value={assignee._id}>
              {assignee?.name}
            </MenuItem>
          )) || null}
        </TextField>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={handleClose}
          sx={{
            borderColor: "#673AB7",
            color: "#673AB7",
            "&:hover": { borderColor: "#673AB7", backgroundColor: "#EDE7F6" },
          }}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          onClick={handleEditSubmit}
          sx={{
            backgroundColor: "#673AB7",
            color: "white",
            "&:hover": {
              backgroundColor: "#5e35b1",
            },
          }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditTaskDialog;
