const Task = require("../models/taskModel");
const User = require("../models/userModel");
const { sendNotification } = require("../socket");

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

    // Notify the task owner
    const ownerNotification = {
      userId: req.user.userId,
      message: `You have created a new task: ${title}`,
      taskId: newTask._id,
    };
    console.log("Sending owner notification:", ownerNotification);
    sendNotification(req.user.userId, ownerNotification);

    // Notify the assignee (if assigned)
    if (assignedTo) {
      const assigneeNotification = {
        userId: assignedTo,
        message: `New task assigned to you: ${title}`,
        taskId: newTask._id,
      };
      console.log("Sending assignee notification:", assigneeNotification);
      sendNotification(assignedTo, assigneeNotification);
    }

    return res.status(201).json({ task: newTask, message: "Task created successfully" });
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

    if (assignedTo && assignedTo !== task.assignedTo.toString()) {
      const notification = {
        userId: assignedTo,
        message: `You have been assigned a new task: ${title}`,
        taskId: updatedTask._id,
      };
      io.to(assignedTo).emit("receiveNotification", notification);
    }

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

    if (task.assignedTo) {
      const notification = {
        userId: task.assignedTo,
        message: `A task assigned to you has been deleted: ${task.title}`,
        taskId: task._id,
      };
      io.to(task.assignedTo).emit("receiveNotification", notification);
    }

    return res.Ok(task, "Task deleted successfully");
  } catch (error) {
    console.error(error);
    return res.InternalError({}, "Internal server error");
  }
};
