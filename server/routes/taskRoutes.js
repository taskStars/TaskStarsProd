const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");

// Import a function that takes `io` and returns route handlers
module.exports = (io) => {
  const {
    createTask,
    createTaskWithAI,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask,
  } = require("../controllers/taskController")(io); // Pass `io` to controller function

  // Task CRUD routes with authentication
  router.post("/createtask", protect, createTask);
  router.post("/createTaskWithAI", protect, createTaskWithAI);
  router.get("/readtasks", protect, getTasks); // Consistent route name for fetching all tasks
  router.get("/:id", protect, getTaskById); // Route to fetch a single task by ID
  router.put("/:id", protect, updateTask);
  router.delete("/:id", protect, deleteTask);

  return router;
};
