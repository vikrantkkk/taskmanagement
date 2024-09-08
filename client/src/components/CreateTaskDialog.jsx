import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";

// Validation schema
const schema = yup.object().shape({
  title: yup.string().required("Title is required"),
});

const CreateTaskDialog = ({ open, handleClose }) => {
  const { enqueueSnackbar } = useSnackbar();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const token = localStorage.getItem("token");

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/task/create-task`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      enqueueSnackbar(response?.data?.message, { variant: "success" });
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle className="px-6 py-4">Create New Task</DialogTitle>
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
                helperText={
                  errors.description ? errors.description.message : ""
                }
                className="mb-4"
              />
            )}
          />

          {/* Status */}
          <FormControl
            fullWidth
            margin="dense"
            variant="outlined"
            className="mb-4"
          >
            <InputLabel>Status</InputLabel>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select {...field} label="Status">
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="inprogress">In Progress</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                </Select>
              )}
            />
          </FormControl>

          {/* Priority */}
          <FormControl
            fullWidth
            margin="dense"
            variant="outlined"
            className="mb-4"
          >
            <InputLabel>Priority</InputLabel>
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <Select {...field} label="Priority">
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
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
        <Button
          onClick={handleClose}
          color="primary"
          sx={{
            borderColor: "#673AB7",
            color: "#673AB7",
            "&:hover": { borderColor: "#673AB7", backgroundColor: "#EDE7F6" },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          color="primary"
          variant="contained"
          sx={{
            backgroundColor: "#673AB7",
            "&:hover": {
              backgroundColor: "#5e35b1", // Hover color
            },
          }}
        >
          Create Task
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateTaskDialog;
