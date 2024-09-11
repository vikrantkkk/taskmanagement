# TaskPro Manager

TaskPro Manager is a comprehensive task management application built using the MERN stack (MongoDB, Express.js, React.js, Node.js) with real-time updates and cron-based reminders. This application allows users to create, manage, and track tasks, with real-time notifications and reminders for pending tasks.

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Technologies](#technologies)
- [Setup Instructions](#setup-instructions)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Cron Jobs](#cron-jobs)
- [Contributing](#contributing)
- [License](#license)

## Project Overview

TaskPro Manager helps users efficiently manage tasks with features like real-time updates, automated email reminders, and user authentication. The application includes:

- Task creation and management
- Real-time notifications
- Email reminders for pending tasks
- User authentication and profile management

## Features

- **Task Management**: Create, update, and delete tasks with various statuses.
- **Real-Time Notifications**: Receive instant notifications about task updates using Socket.io.
- **Email Reminders**: Automated reminders for tasks based on their status.
- **User Authentication**: Secure login and registration with email verification.

## Technologies

- **Frontend**: React.js, Vite, Tailwind CSS, RTK Query
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Real-Time Updates**: Socket.io
- **Email**: Nodemailer
- **Cron Jobs**: node-cron
- **Validation**: Yup with React Hook Form

## Setup Instructions

### Prerequisites

- Node.js (>= 14.x)
- MongoDB (locally or cloud-based)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/taskpro-manager.git
   cd taskpro-manager
