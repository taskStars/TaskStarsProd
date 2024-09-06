// routes/taskRoutes.js
const express = require("express");
const router = express.Router();
const {
  createTask,
  getTasks,
  getTaskById,  // New function to get a single task by ID
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const { protect } = require("../middlewares/authMiddleware");

// Task CRUD routes with authentication
router.post("/createtask", protect, createTask);
router.get("/readtask", protect, getTasks);
router.get("/:id", protect, getTaskById);  // New route to fetch a single task by ID
router.put("/:id", protect, updateTask);
router.delete("/:id", protect, deleteTask);

module.exports = router;
