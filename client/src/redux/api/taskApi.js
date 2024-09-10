import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define the base URL for your API
const BASE_URL = "http://localhost:5000/api/v1/task/"; // Replace with your API URL

// Create an API slice with Redux Toolkit
export const taskApi = createApi({
  reducerPath: "taskApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = localStorage.getItem("token");
      console.log("🚀 ~ token:", token);
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Mutation for creating a task
    createTask: builder.mutation({
      query: (taskData) => ({
        url: "create-task",
        method: "POST",
        body: taskData,
      }),
    }),
    // Mutation for updating a task
    updateTask: builder.mutation({
      query: ({ taskId, taskData }) => ({
        url: `update/${taskId}`,
        method: "PUT",
        body: taskData,
      }),
    }),
    // Mutation for deleting a task
    deleteTask: builder.mutation({
      query: (taskId) => ({
        url: `delete/${taskId}`,
        method: "DELETE",
      }),
    }),
    // Query for fetching all tasks
    getUserTasks: builder.query({
      query: () => ({
        url: "get-user-task",
        method: "GET",
      }),
    }),
  }),
});

// Export hooks for the defined queries and mutations
export const {
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useGetUserTasksQuery,
} = taskApi;
