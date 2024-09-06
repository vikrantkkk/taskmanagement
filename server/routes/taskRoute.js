const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  createTask,
  getUserTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const authorizeRoles = require("../middlewares/authorizeRole");

const router = express.Router();

router.post("/create-task", authMiddleware, createTask);
router.get("/get-user-task", authMiddleware, getUserTask);
router.put(
  "/update-task/:taskId",
  authMiddleware,
  authorizeRoles(["admin", "user"]),
  updateTask
);
router.delete(
  "/delete-task/:taskId",
  authMiddleware,
  authorizeRoles(["admin", "user"]),
  deleteTask
);

module.exports = router;
