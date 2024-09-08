import React, { useState } from 'react';
import { Typography, TextField, FormControl, FormControlLabel, Checkbox, Button, Divider, MenuItem, Select, InputLabel } from '@mui/material';
import { Save, Cancel } from '@mui/icons-material';

const Setting = () => {
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState('light');
  const [profileName, setProfileName] = useState('John Doe');
  const [profileEmail, setProfileEmail] = useState('john.doe@example.com');

  const handleSave = () => {
    // Handle save logic here
    console.log('Settings saved');
  };

  const handleCancel = () => {
    // Handle cancel logic here
    console.log('Changes canceled');
  };

  return (
    <div className="p-6 space-y-6">
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <Typography variant="h6" gutterBottom>
          Profile Settings
        </Typography>
        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={profileName}
          onChange={(e) => setProfileName(e.target.value)}
        />
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          type="email"
          value={profileEmail}
          onChange={(e) => setProfileEmail(e.target.value)}
        />
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <Typography variant="h6" gutterBottom>
          Notification Settings
        </Typography>
        <FormControlLabel
          control={
            <Checkbox
              checked={notificationEnabled}
              onChange={(e) => setNotificationEnabled(e.target.checked)}
            />
          }
          label="Enable Notifications"
        />
        <Typography variant="body2" color="text.secondary">
          Receive notifications for task updates and system alerts.
        </Typography>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <Typography variant="h6" gutterBottom>
          Theme Preferences
        </Typography>
        <FormControl fullWidth margin="normal">
          <InputLabel>Theme</InputLabel>
          <Select
            value={selectedTheme}
            onChange={(e) => setSelectedTheme(e.target.value)}
            label="Theme"
          >
            <MenuItem value="light">Light</MenuItem>
            <MenuItem value="dark">Dark</MenuItem>
          </Select>
        </FormControl>
      </div>

      <Divider />

      <div className="flex justify-end space-x-4">
        <Button
          variant="contained"
          color="primary"
          startIcon={<Save />}
          onClick={handleSave}
        >
          Save Changes
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          startIcon={<Cancel />}
          onClick={handleCancel}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default Setting;
