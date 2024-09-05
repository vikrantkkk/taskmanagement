const mongoose = require("mongoose");

const subtaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    status: {
      type: String,
      enum: ["To Do", "In Progress", "Done"],
      default: "To Do",
    },
    task: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const SubTask = mongoose.model("Subtask", subtaskSchema);
module.exports = SubTask;
