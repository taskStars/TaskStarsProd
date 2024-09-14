// routes/taskRoutes.js
const express = require("express");
const router = express.Router();
const {
  createTask,
  getTasks,
  getTaskById,  // Function to get a single task by ID
  updateTask,
  deleteTask,createTaskWithAI,
} = require("../controllers/taskController");
const { protect } = require("../middlewares/authMiddleware");

// Task CRUD routes with authentication
router.post("/createtask", protect, createTask);
router.post("/createTaskWithAI", protect, createTaskWithAI);
router.get("/readtasks", protect, getTasks);  // Consistent route name for fetching all tasks
router.get("/:id", protect, getTaskById);  // Route to fetch a single task by ID
router.put("/:id", protect, updateTask);
router.delete("/:id", protect, deleteTask);

module.exports = router;