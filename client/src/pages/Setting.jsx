import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { TextField, Button, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { resetTasks } from "../redux/taskSlice";
import { resetUser } from "../redux/userSlice";
import { useDispatch } from "react-redux";

const schema = Yup.object().shape({
  currentPassword: Yup.string().required("Current password is required"),
  newPassword: Yup.string()
    .min(6, "New password must be at least 6 characters")
    .required("New password is required"),
  confirmNewPassword: Yup.string()
    .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
    .required("Confirm new password is required"),
});

const SettingsPage = () => {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const onSubmitPassword = async (data) => {
    console.log("🚀 ~ onSubmitPassword ~ data:", data);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/user/change-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          credentials: "include",
          body: JSON.stringify({
            oldPassword: data.currentPassword,
            newPassword: data.newPassword,
          }),
        }
      );

      if (response.ok) {
        enqueueSnackbar("Password updated successfully", {
          variant: "success",
        });
        reset({
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        });
      } else {
        const result = await response.json();
        enqueueSnackbar(result.message || "Failed to update password", {
          variant: "error",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      enqueueSnackbar("An error occurred while updating the password", {
        variant: "error",
      });
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/user/delete-user/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          credentials: "include",
        }
      );

      if (response.ok) {
        enqueueSnackbar("Account deleted successfully", { variant: "success" });
        navigate("/");
        dispatch(resetTasks());
        dispatch(resetUser());
        localStorage.clear();
      } else {
        const result = await response.json();
        enqueueSnackbar(result.message || "Failed to delete account", {
          variant: "error",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      enqueueSnackbar("An error occurred while deleting the account", {
        variant: "error",
      });
    }
  };

  return (
    <div className="min-h-screen py-10">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-700 mb-8">Settings</h1>

        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-600 mb-4">
            Update Password
          </h2>
          <form onSubmit={handleSubmit(onSubmitPassword)} className="space-y-4">
            <Controller
              name="currentPassword"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Current Password"
                  type={showCurrentPassword ? "text" : "password"}
                  fullWidth
                  variant="outlined"
                  error={!!errors.currentPassword}
                  helperText={errors.currentPassword?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() =>
                            setShowCurrentPassword(!showCurrentPassword)
                          }
                          edge="end"
                        >
                          {showCurrentPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />

            <Controller
              name="newPassword"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="New Password"
                  type={showNewPassword ? "text" : "password"}
                  fullWidth
                  variant="outlined"
                  error={!!errors.newPassword}
                  helperText={errors.newPassword?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          edge="end"
                        >
                          {showNewPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />

            <Controller
              name="confirmNewPassword"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Confirm New Password"
                  type={showConfirmNewPassword ? "text" : "password"}
                  fullWidth
                  variant="outlined"
                  error={!!errors.confirmNewPassword}
                  helperText={errors.confirmNewPassword?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() =>
                            setShowConfirmNewPassword(!showConfirmNewPassword)
                          }
                          edge="end"
                        >
                          {showConfirmNewPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              className="mt-4"
              sx={{
                backgroundColor: "#673AB7",
                "&:hover": {
                  backgroundColor: "#5e35b1",
                },
              }}
            >
              Update Password
            </Button>
          </form>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-red-600 mb-4">
            Permanently Delete Your Account
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Deleting your account is permanent and cannot be undone. All of your
            data will be lost.
          </p>

          {!isConfirmingDelete ? (
            <Button
              onClick={() => setIsConfirmingDelete(true)}
              variant="contained"
              color="error"
              fullWidth
            >
              Delete Account
            </Button>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Are you sure you want to permanently delete your account? This
                action cannot be undone.
              </p>
              <Button
                onClick={handleDeleteAccount}
                variant="contained"
                color="error"
                fullWidth
              >
                Yes, Delete My Account
              </Button>
              <Button
                onClick={() => setIsConfirmingDelete(false)}
                variant="outlined"
                color="default"
                fullWidth
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
