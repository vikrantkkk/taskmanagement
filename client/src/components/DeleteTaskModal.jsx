import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";

const DeleteTaskDialog = ({
  open,
  handleClose,
  handleDelete,
  selectedTask,
  loading,
}) => {
  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>Delete Task</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete the task "{selectedTask?.title}"?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button
          onClick={handleDelete}
          color="primary"
          disabled={loading}
          variant="contained"
        >
          {loading ? <CircularProgress size={24} /> : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteTaskDialog;
