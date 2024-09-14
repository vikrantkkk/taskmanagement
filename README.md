# TaskPro

**TaskPro** is a feature-rich task management application built using the MERN stack (MongoDB, Express.js, React.js, Node.js). The application supports real-time updates and automated reminders for pending tasks, enabling users to effectively manage and track tasks.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technologies](#technologies)
- [Setup Instructions](#setup-instructions)
- [Cron Jobs](#cron-jobs)

## Project Overview

TaskPro empowers users to efficiently handle their tasks by providing real-time updates, automated email reminders, and secure user authentication. The key features include:

- Task creation and management
- Real-time task notifications
- Email reminders for pending tasks
- User authentication and profile management

## Features

- **Task Management**: Create, update, and delete tasks with various statuses (e.g., To Do, In Progress, Done).
- **Real-Time Notifications**: Receive real-time task update notifications using Socket.io.
- **Email Reminders**: Automatically send email reminders for pending tasks after 30 minutes of task creation using cron jobs.
- **User Authentication**: Secure login and registration with email verification.
- **Cron Jobs**: Automated scheduling of reminders for tasks that remain pending.

## Technologies

- **Frontend**: React.js, Vite, Material UI, Tailwind CSS, RTK Query, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Real-Time Updates**: Socket.io
- **Email**: Nodemailer
- **Cron Jobs**: node-cron
- **Validation**: Yup with React Hook Form

## Setup Instructions

To set up the project locally, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/vikrantkkk/taskmanagement.git
   ```
2. **Navigate to the project directory:**
   cd taskmanagement
3. **Install and run the backend server:**
   1 cd server ->
   2 npm install ->
   3 npm run dev ->
4. **Install and run the backend server:**
   1 cd client ->
   2 npm install ->
   3 npm run dev ->
