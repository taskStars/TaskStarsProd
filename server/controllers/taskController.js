const Task = require("../models/Task");

// Create a new task
exports.createTask = async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      user: req.user.id, // Associate task with the logged-in user
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all tasks for the logged-in user, sorted by deadline
exports.getTasks = async (req, res) => {
  try {
    // Ensure the user is authenticated
    if (!req.user || !req.user.id) {
      console.error("Authorization Error: No user found in request.");
      return res.status(401).json({ message: "Unauthorized: No user found." });
    }

    // Fetch tasks only for the logged-in user and sort by deadline in ascending order
    const tasks = await Task.find({ user: req.user.id }).sort({ deadline: 1 });

    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error); // Improved error logging
    res.status(500).json({ error: "Failed to fetch tasks." });
  }
};



// Get a single task by ID if it belongs to the logged-in user
exports.getTaskById = async (req, res) => {
  try {
    // Ensure that the task belongs to the logged-in user
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });

    if (!task) {
      return res
        .status(404)
        .json({ message: "Task not found or not authorized" });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a task if it belongs to the logged-in user
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id }, // Ensure user can only update their own tasks
      req.body,
      { new: true }
    );

    if (!task) {
      return res
        .status(404)
        .json({ message: "Task not found or not authorized" });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a task if it belongs to the logged-in user
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!task) {
      return res
        .status(404)
        .json({ message: "Task not found or not authorized" });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
