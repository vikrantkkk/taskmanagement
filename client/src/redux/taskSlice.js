import { createSlice } from "@reduxjs/toolkit";

const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: [],
  },
  reducers: {
    // Action to add a task
    addTask: (state, action) => {
      const { data } = action.payload;
      state.tasks.push(data);
    },
    // Action to update a task
    updateTask: (state, action) => {
      const { id, updatedTask } = action.payload;
      const taskIndex = state.tasks.findIndex((task) => task.id === id);
      if (taskIndex !== -1) {
        state.tasks[taskIndex] = updatedTask;
      }
    },
    // Action to remove a task
    removeTask: (state, action) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
    },
    // Action to set tasks fetched from an API or other source
    setUserTasks: (state, action) => {
      state.tasks = action.payload;
    },
  },
});

// Export actions for components to use
export const { addTask, updateTask, removeTask, setUserTasks } = taskSlice.actions;

// Export reducer to be added to the store
export default taskSlice.reducer;
