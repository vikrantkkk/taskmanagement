import React from 'react';
import { Typography } from '@mui/material';
import TaskList from '../components/TaskList';

const Dashboard = () => {
  return (
    <div className="p-6">
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body1" paragraph>
        Welcome to the dashboard of your task management system!
      </Typography>
      <TaskList />
    </div>
  );
};

export default Dashboard;
