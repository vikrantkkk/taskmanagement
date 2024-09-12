import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = "http://localhost:5000/api/v1/task/";

export const taskApi = createApi({
  reducerPath: "taskApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    createTask: builder.mutation({
      query: (taskData) => ({
        url: "create-task",
        method: "POST",
        body: taskData,
      }),
    }),

    updateTask: builder.mutation({
      query: ({ taskId, taskData }) => ({
        url: `update-task/${taskId}`,
        method: "PUT",
        body: taskData,
      }),
    }),

    deleteTask: builder.mutation({
      query: (taskId) => ({
        url: `delete-task/${taskId}`,
        method: "DELETE",
      }),
    }),

    getUserTasks: builder.query({
      query: (sort) => ({
        url: "get-user-task",
        params: { sort },
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useGetUserTasksQuery,
} = taskApi;
