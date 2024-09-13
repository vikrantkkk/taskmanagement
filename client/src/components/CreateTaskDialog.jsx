import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  Select as MuiSelect,
  InputLabel,
  FormControl,
  Autocomplete,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useSnackbar } from "notistack";
import {
  useCreateTaskMutation,
  useGetUserTasksQuery,
} from "../redux/api/taskApi";
import { addTask } from "../redux/taskSlice";
import { useDispatch } from "react-redux";

const schema = yup.object().shape({
  title: yup.string().required("Title is required"),
  dueDate: yup
    .date()
    .required("Due date is required")
    .min(
      new Date().toISOString().split("T")[0],
      "Due date cannot be in the past"
    ),
});

const CreateTaskDialog = ({ open, handleClose }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [users, setUsers] = useState([]);
  const [createTask] = useCreateTaskMutation();
  const dispatch = useDispatch();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(schema),

    defaultValues: {
      title: "",
      description: "",
      status: "pending",
      priority: "medium",
      dueDate: new Date().toISOString().split("T")[0],
      assignedTo: [],
    },
    resolver: yupResolver(schema),
  });

  const token = localStorage.getItem("token");

  const { refetch } = useGetUserTasksQuery();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/user/get-all-user`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials:true
          }
        );
        setUsers(
          data.data.map((user) => ({
            value: user._id,
            label: user.name,
          }))
        );
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsers();
  }, [token]);

  const onSubmit = async (data) => {
    try {
      const taskData = {
        ...data,
        assignedTo: data?.assignedTo?.map((user) => user?.value) || null,
      };
      const response = await createTask(taskData).unwrap();
      enqueueSnackbar(response?.message, { variant: "success" });
      dispatch(addTask(response));
      refetch();
      reset({
        title: "",
        description: "",
        status: "pending",
        priority: "medium",
        dueDate: new Date().toISOString().split("T")[0],
        assignedTo: [],
      });
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      sx={{
        height: "90%",
        margin: "4rem 0 0 0",
      }}
    >
      <DialogTitle>Create New Task</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
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
                <MuiSelect {...field} label="Status">
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="inprogress">In Progress</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                </MuiSelect>
              )}
            />
          </FormControl>

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
                <MuiSelect {...field} label="Priority">
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </MuiSelect>
              )}
            />
          </FormControl>

          <Controller
            name="dueDate"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Due Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                fullWidth
                margin="dense"
                variant="outlined"
                error={!!errors.dueDate}
                helperText={errors.dueDate ? errors.dueDate.message : ""}
                className="mb-4"
              />
            )}
          />

          <Controller
            name="assignedTo"
            control={control}
            render={({ field }) => (
              <Autocomplete
                {...field}
                multiple
                options={users}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Assigned To"
                    variant="outlined"
                    error={!!errors.assignedTo}
                    helperText={
                      errors.assignedTo ? errors.assignedTo.message : ""
                    }
                  />
                )}
                onChange={(_, newValue) => setValue("assignedTo", newValue)}
                className="mb-4"
              />
            )}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClose}
          sx={{
            borderColor: "#673AB7",
            color: "#673AB7",
            "&:hover": { borderColor: "#673AB7", backgroundColor: "#EDE7F6" },
          }}
          color="primary"
          variant="outlined"
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
              backgroundColor: "#5e35b1",
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
