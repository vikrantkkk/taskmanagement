import React from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Validation schema
const schema = yup.object().shape({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  status: yup.string().required("Status is required"),
  priority: yup.string().required("Priority is required"),
  assignedTo: yup.string().required("Assigned User is required"),
});

const CreateTaskDialog = ({ open, handleClose }) => {
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      // Your task creation logic here
      console.log(data);
      handleClose(); // Close the dialog after successful submission
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        className: "rounded-lg" // Rounded corners for the dialog box
      }}
    >
      <DialogTitle
        className="bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 text-white rounded-t-lg px-6 py-4"
      >
        Create New Task
      </DialogTitle>
      <DialogContent className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          {/* Title */}
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Task Title"
                fullWidth
                margin="dense"
                variant="outlined"
                error={!!errors.title}
                helperText={errors.title ? errors.title.message : ""}
                className="mb-4"
              />
            )}
          />

          {/* Description */}
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Task Description"
                multiline
                rows={3}
                fullWidth
                margin="dense"
                variant="outlined"
                error={!!errors.description}
                helperText={errors.description ? errors.description.message : ""}
                className="mb-4"
              />
            )}
          />

          {/* Status */}
          <FormControl fullWidth margin="dense" variant="outlined" className="mb-4">
            <InputLabel>Status</InputLabel>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select {...field} label="Status">
                  <MenuItem value="To Do">To Do</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                </Select>
              )}
            />
          </FormControl>

          {/* Priority */}
          <FormControl fullWidth margin="dense" variant="outlined" className="mb-4">
            <InputLabel>Priority</InputLabel>
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <Select {...field} label="Priority">
                  <MenuItem value="Low">Low</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                </Select>
              )}
            />
          </FormControl>

          {/* Assigned To */}
          <Controller
            name="assignedTo"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Assigned To (User ID)"
                fullWidth
                margin="dense"
                variant="outlined"
                error={!!errors.assignedTo}
                helperText={errors.assignedTo ? errors.assignedTo.message : ""}
                className="mb-4"
              />
            )}
          />
        </form>
      </DialogContent>
      <DialogActions className="p-6">
        <Button onClick={handleClose} color="primary" className="bg-gray-300 hover:bg-gray-400">
          Cancel
        </Button>
        <Button onClick={handleSubmit(onSubmit)} color="primary" variant="contained" className="bg-blue-500 hover:bg-blue-600">
          Create Task
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateTaskDialog;
