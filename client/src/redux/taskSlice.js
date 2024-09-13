import { createSlice } from "@reduxjs/toolkit";

const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: [],
  },
  reducers: {
   
    addTask: (state, action) => {
      const { data } = action.payload;
      state.tasks.push(data);
    },

    updateTask: (state, action) => {
      const { id, updatedTask } = action.payload;
      const taskIndex = state.tasks.findIndex((task) => task.id === id);
      if (taskIndex !== -1) {
        state.tasks[taskIndex] = updatedTask;
      }
    },
 
    removeTask: (state, action) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
    },

    setUserTasks: (state, action) => {
      state.tasks = action.payload;
    },
    resetTasks: (state) => {
      state.tasks = []; 
    },
  },
});

export const { addTask, updateTask, removeTask, setUserTasks, resetTasks } = taskSlice.actions;

export default taskSlice.reducer;
