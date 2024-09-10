import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { TextField, Button, Checkbox, FormControlLabel, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useSnackbar } from 'notistack';

// Define validation schema with Yup
const schema = Yup.object().shape({
  currentPassword: Yup.string().required('Current password is required'),
  newPassword: Yup.string()
    .min(6, 'New password must be at least 6 characters')
    .required('New password is required'),
  confirmNewPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
    .required('Confirm new password is required'),
  emailNotifications: Yup.boolean(),
  smsNotifications: Yup.boolean(),
});

const SettingsPage = () => {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  // Initialize React Hook Form
  const { control, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const onSubmitPassword = async (data) => {
    try {
      const response = await fetch('http://localhost:5000/api/v1/user/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Assuming token is stored in localStorage
        },
        body: JSON.stringify({
          oldPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
      });

      if (response.ok) {
        enqueueSnackbar('Password updated successfully', { variant: 'success' });
        reset(); // Reset form fields
      } else {
        const result = await response.json();
        enqueueSnackbar(result.message || 'Failed to update password', { variant: 'error' });
      }
    } catch (error) {
      console.error('Error:', error);
      enqueueSnackbar('An error occurred while updating the password', { variant: 'error' });
    }
  };

  const onSubmitPreferences = async (data) => {
    try {
      // Implement your logic for saving notification preferences here
      console.log('Preferences saved:', data);
      enqueueSnackbar('Preferences saved successfully', { variant: 'success' });
    } catch (error) {
      console.error('Error:', error);
      enqueueSnackbar('An error occurred while saving preferences', { variant: 'error' });
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const userId = '66da9c744c07e5c77c0968c4'; // Replace with the actual user ID or obtain it dynamically
      const response = await fetch(`http://localhost:5000/api/v1/user/delete-user/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Assuming token is stored in localStorage
        },
      });

      if (response.ok) {
        enqueueSnackbar('Account deleted successfully', { variant: 'success' });
        // Optionally redirect the user or perform other actions
      } else {
        const result = await response.json();
        enqueueSnackbar(result.message || 'Failed to delete account', { variant: 'error' });
      }
    } catch (error) {
      console.error('Error:', error);
      enqueueSnackbar('An error occurred while deleting the account', { variant: 'error' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto p-6 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-700 mb-8">Settings</h1>

        {/* Password Update Section */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-600 mb-4">Update Password</h2>
          <form onSubmit={handleSubmit(onSubmitPassword)} className="space-y-4">
            <Controller
              name="currentPassword"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Current Password"
                  type={showCurrentPassword ? 'text' : 'password'}
                  fullWidth
                  variant="outlined"
                  error={!!errors.currentPassword}
                  helperText={errors.currentPassword ? errors.currentPassword.message : ''}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          edge="end"
                        >
                          {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
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
                  type={showNewPassword ? 'text' : 'password'}
                  fullWidth
                  variant="outlined"
                  error={!!errors.newPassword}
                  helperText={errors.newPassword ? errors.newPassword.message : ''}
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
                  type={showConfirmNewPassword ? 'text' : 'password'}
                  fullWidth
                  variant="outlined"
                  error={!!errors.confirmNewPassword}
                  helperText={errors.confirmNewPassword ? errors.confirmNewPassword.message : ''}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                          edge="end"
                        >
                          {showConfirmNewPassword ? <VisibilityOff /> : <Visibility />}
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
            >
              Update Password
            </Button>
          </form>
        </div>

        {/* Notification Preferences Section */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-600 mb-4">Notification Preferences</h2>
          <form onSubmit={handleSubmit(onSubmitPreferences)} className="space-y-4">
            <Controller
              name="emailNotifications"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox {...field} checked={field.value} />}
                  label="Receive Email Notifications"
                />
              )}
            />

            <Controller
              name="smsNotifications"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox {...field} checked={field.value} />}
                  label="Receive SMS Notifications"
                />
              )}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              className="mt-4"
            >
              Save Preferences
            </Button>
          </form>
        </div>

        {/* Permanently Delete Account Section */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-red-600 mb-4">Permanently Delete Your Account</h2>
          <p className="text-sm text-gray-600 mb-4">
            Deleting your account is permanent and cannot be undone. All of your data will be lost.
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
                Are you sure you want to permanently delete your account? This action cannot be undone.
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
