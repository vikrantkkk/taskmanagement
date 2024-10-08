# TaskPro

**TaskPro** is a feature-rich task management application built using the MERN stack (MongoDB, Express.js, React.js, Node.js). The application supports real-time updates and automated reminders for pending tasks, enabling users to effectively manage and track tasks.

You can view the live application at: [https://frontendtaskmanagement.vercel.app](https://frontendtaskmanagement.vercel.app/)

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technologies](#technologies)
- [Real-Time Messaging (Socket.io)](#real-time-messaging-socketio)
- [Cron Jobs](#cron-jobs)
- [Email Features (Nodemailer)](#email-features-nodemailer)
  - [Login](#login)
  - [Register](#register)
  - [OTP Verification](#otp-verification)
  - [Forgot Password](#forgot-password)
  - [Reset Password](#reset-password)
  - [Authentication](#authentication)
  - [Change Password](#change-password)
  - [Update Profile Picture](#update-profile-picture)
- [Rate Limiting](#rate-limiting)
- [Setup Instructions](#setup-instructions)

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
- **Task Prioritization**: Assign priority levels to tasks for better organization and focus.
- **Task Assignment**: Assign tasks to team members for collaborative work.
- **Task Due Date**: Set due dates for tasks to ensure timely completion.
- **Task Status**: Track task status changes in real-time.

## Technologies

- **Frontend**: React.js, Vite, Material UI, Tailwind CSS, RTK Query, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Real-Time Updates**: Socket.io
- **Email**: Nodemailer
- **Cron Jobs**: node-cron
- **Validation**: Yup with React Hook Form

## Real-Time Messaging (Socket.io)

Real-time updates are handled using Socket.io. This allows for instant notifications and updates across the application.

## Cron Jobs

Automated tasks and reminders are managed using `node-cron`. For example, email reminders are sent for pending tasks after 30 minutes.

## Email Features (Nodemailer)

- **Login**: Users receive a login email with a link to access their dashboard.
- **Register**: Users get a confirmation email upon registration.
- **OTP Verification**: An OTP is sent via email for user verification during registration.
- **Forgot Password**: Users can request a password reset by entering their email. They receive an OTP (One-Time Password) via email to verify their identity.
- **Reset Password**: After successfully verifying the OTP, users can reset their password using a secure form.
- **Authentication**: Emails are used to verify and authenticate user identity.
- **Change Password**: Users receive a notification email after changing their password.
- **Update Profile Picture**: Users are notified by email when their profile picture is updated.

## Rate Limiting

**Login API**: To protect against brute-force attacks, the login API is rate-limited to a maximum of 5 attempts per IP address every 15 minutes. If the limit is exceeded, users will receive a message indicating that they have made too many attempts and should try again later.

## Setup Instructions

To set up the project locally, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/vikrantkkk/taskmanagement.git
   ```
2. **Navigate to the project directory:**
   cd taskmanagement
3. **Install and run the backend server:**
   cd server ->
   npm install ->
   npm run dev
4. **Install and run the frontend client:**
   cd client ->
   npm install ->
   npm run dev

## Note

- **Environment Variables**: Before running the project, make sure to configure the environment variables for both the backend and frontend.
- **Frontend (.env)**

```plaintext
VITE_API_BASE_URL=http://localhost:5000/api/v1 # This should match the API base URL used in the backend environment configuration.
```

- **Backend (.env)**

```plaintext
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
PORT=5000
EMAIL_USERNAME=example@example.com
EMAIL_PASSWORD=your_email_password
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FRONTEND_URL=http://localhost:5173 # Update this to the URL of your frontend
NODE_ENV=Development
```
