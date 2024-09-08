const Task = require("../models/taskModel");
const User = require("../models/userModel");

exports.createTask = async (req, res) => {
  try {
    const { title, description, status, priority, assignedTo } = req.body;
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }
    if (assignedTo) {
      const user = await User.findById(assignedTo);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
    }

    const newTask = await Task.create({
      title,
      description,
      status,
      priority,
      owner: req.user.userId,
      assignedTo: assignedTo || null,
    });
    return res
      .status(201)
      .json({ task: newTask, message: "Task created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getUserTask = async (req, res) => {
  try {
    const { userId } = req.user;

    const tasks = await Task.find({
      $or: [{ owner: userId }, { assignedTo: userId }],
    })
      .populate("owner", "firstName lastName")
      .populate("assignedTo", "firstName lastName");

    if (!tasks.length) {
      return res.NotFound({}, "No tasks found for the user");
    }

    res.Ok(tasks, "All Task fetched successfully");
  } catch (error) {
    console.log(error);
    res.InternalError({}, "Internal server error");
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, description, status, priority, assignedTo } = req.body;
    const task = await Task.findById(taskId);
    if (!task) {
      return res.NotFound({}, "Task not found");
    }

    if (
      task.owner.toString() !== req.user.userId &&
      task.assignedTo.toString() !== req.user.userId
    ) {
      return res.Forbidden({}, "You are not authorized to update this task");
    }

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      {
        $set: {
          title: title || task.title,
          description: description || task.description,
          status: status || task.status,
          priority: priority || task.priority,
          assignedTo: assignedTo || task.assignedTo,
        },
      },
      { new: true }
    )
      .populate("owner", "firstName lastName")
      .populate("assignedTo", "firstName lastName");

    res.Ok(updatedTask, "Task updated successfully");
  } catch (error) {
    console.log(error);
    res.InternalError({}, "Internal server error");
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.NotFound({}, "Task not found");
    }

    if (
      task.owner.toString() !== req.user.userId &&
      req.user.role !== "admin"
    ) {
      return res.Forbidden({}, "You are not authorized to delete this task");
    }

    await Task.findByIdAndDelete(taskId);
    return res.Ok(task, "Task deleted successfully");
  } catch (error) {
    console.error(error);
    return res.InternalError({}, "Internal server error");
  }
};
