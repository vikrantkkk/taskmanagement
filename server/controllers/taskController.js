const Task = require("../models/taskModel");
const User = require("../models/userModel");


exports.createTask = async (req, res) => {
  try {
    const { title, description, status, priority, assignedTo, dueDate } = req.body;
    
    if (!title) {
      return res.BadRequest({ message: "Title is required" });
    }

  
    if (assignedTo && assignedTo.length > 0) {
      const users = await User.find({ _id: { $in: assignedTo } });
      if (users.length !== assignedTo.length) {
        return res.NotFound({ message: "One or more assigned users not found" });
      }
    }

   
    const newTask = await Task.create({
      title,
      description,
      status,
      priority,
      owner: req.user.userId,
      assignedTo: assignedTo || [], 
      dueDate: dueDate || null, 
    });

    
    const io = req.app.get("io");
    io.emit("newTaskNotification", {
      message: `Task "${newTask.title}" has been created!`,
      taskId: newTask._id,
      timestamp: new Date()
    });

    const newTaskData = JSON.parse(JSON.stringify(newTask));
    return res.Create(newTaskData, "Task created successfully");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


exports.getUserTask = async (req, res) => {
  try {
    const { userId } = req.user;

    const sortOrder = req.query.sort === "oldest" ? 1 : -1

    const tasks = await Task.find({
      $or: [{ owner: userId }, { assignedTo: { $in: [userId] } }]
    })
      .populate("owner", "name")
      .populate("assignedTo", "name")
      .sort({ createdAt: sortOrder });

    if (!tasks.length) {
      return res.NotFound({}, "No tasks found for the user");
    }

    res.Ok(tasks, "All tasks fetched successfully");
  } catch (error) {
    console.log(error);
    res.InternalError({}, "Internal server error");
  }
};


exports.updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, description, status, priority, assignedTo, dueDate } = req.body;
    
    const task = await Task.findById(taskId);
    if (!task) {
      return res.NotFound({}, "Task not found");
    }

    
    const isOwner = task.owner.toString() === req.user.userId;
    const isAssignedUser = task.assignedTo.includes(req.user.userId);
    if (!isOwner && !isAssignedUser) {
      return res.ForBidden({}, "You are not authorized to update this task");
    }

    
    if (assignedTo && assignedTo.length > 0) {
      const users = await User.find({ _id: { $in: assignedTo } });
      if (users.length !== assignedTo.length) {
        return res.NotFound({ message: "One or more assigned users not found" });
      }
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
          dueDate: dueDate || task.dueDate,
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

    if (task.owner.toString() !== req.user.userId && req.user.role !== "admin") {
      return res.ForBidden({}, "You are not authorized to delete this task");
    }

    await Task.findByIdAndDelete(taskId);
    return res.Ok(task, "Task deleted successfully");
  } catch (error) {
    console.error(error);
    return res.InternalError({}, "Internal server error");
  }
};
