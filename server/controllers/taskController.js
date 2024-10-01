const Task = require("../models/Task");
const { Configuration, OpenAIApi } = require("openai");
const chrono = require("chrono-node");

// Export a function that receives `io` as an argument
module.exports = (io) => {
  // Create a new task
  const createTask = async (req, res) => {
    try {
      const task = new Task({
        ...req.body,
        user: req.user.id,
      });

      await task.save();

      // Emit an event to all connected clients when a new task is added
      io.emit("task_added", task);

      res.status(201).json(task);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  // Get all tasks for the logged-in user
  const getTasks = async (req, res) => {
    try {
      if (!req.user || !req.user.id) {
        console.error("Authorization Error: No user found in request.");
        return res
          .status(401)
          .json({ message: "Unauthorized: No user found." });
      }

      const tasks = await Task.find({ user: req.user.id }).sort({
        deadline: 1,
      });
      res.status(200).json(tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ error: "Failed to fetch tasks." });
    }
  };

  // Get a single task by ID
  const getTaskById = async (req, res) => {
    try {
      const task = await Task.findOne({
        _id: req.params.id,
        user: req.user.id,
      });

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
  const updateTask = async (req, res) => {
    try {
      const task = await Task.findOneAndUpdate(
        { _id: req.params.id, user: req.user.id },
        req.body,
        { new: true }
      );

      if (!task) {
        return res
          .status(404)
          .json({ message: "Task not found or not authorized" });
      }

      // Emit an event to all connected clients when a task is updated
      io.emit("task_updated", task);

      res.status(200).json(task);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  // Delete a task if it belongs to the logged-in user
  const deleteTask = async (req, res) => {
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

      // Emit an event to all connected clients when a task is deleted
      io.emit("task_deleted", req.params.id);

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Create a new task using OpenAI
  const createTaskWithAI = async (req, res) => {
    try {
      const { taskDescription, priority = "Medium", tags = [] } = req.body;

      if (!taskDescription) {
        return res
          .status(400)
          .json({ message: "Task description is required." });
      }

      // Initialize OpenAI API
      const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
      });
      const openai = new OpenAIApi(configuration);

      // Send request to OpenAI with a prompt to generate both a title and a description
      const openaiResponse = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `Generate a task title and a short description based on this input: "${taskDescription}". If applicable, include a deadline as "Deadline: [actual date or relative expression]" by interpreting any relative date expressions (like "tomorrow", "next week") into natural language.`,
          },
        ],
        max_tokens: 150,
      });

      const gptOutput = openaiResponse.data.choices[0].message.content.trim();
      const titleMatch = gptOutput.match(/Title:\s*(.+)/);
      const descriptionMatch = gptOutput.match(/Description:\s*(.+)/);
      const deadlineMatch = gptOutput.match(/Deadline:\s*(.+)/);

      const title = titleMatch ? titleMatch[1].trim() : "Generated Task";
      const description = descriptionMatch
        ? descriptionMatch[1].trim()
        : "No description provided.";
      const deadlineString = deadlineMatch ? deadlineMatch[1].trim() : null;
      let deadline = null;

      if (deadlineString && deadlineString.toLowerCase() !== "no deadline") {
        const now = new Date(); // Current date
        let parsedDate = chrono.parseDate(deadlineString, now);

        if (parsedDate) {
          // If the parsed date is in the past, adjust the year
          if (parsedDate < now) {
            parsedDate.setFullYear(parsedDate.getFullYear() + 1);
          }
          deadline = parsedDate;
        }
      }

      const task = new Task({
        title,
        description,
        deadline,
        priority,
        tags: Array.isArray(tags) ? tags : [],
        user: req.user.id,
      });

      await task.save();
      io.emit("task_added", task); // Emit an event for new AI-generated task
      res.status(201).json(task);
    } catch (error) {
      console.error("Error creating task:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  // Generate a task description using OpenAI
  const generateTaskDescription = async (req, res) => {
    try {
      const { input } = req.body;

      if (!input) {
        return res.status(400).json({ message: "Input is required" });
      }

      const apiKey = process.env.OPENAI_API_KEY?.trim();

      if (!apiKey) {
        return res.status(500).json({ message: "API key is missing" });
      }

      const prompt = `Generate a task description in one line based on this input: ${input}`;

      // Initialize OpenAI API
      const configuration = new Configuration({
        apiKey: apiKey,
      });
      const openai = new OpenAIApi(configuration);

      // Call the OpenAI API
      const openaiResponse = await openai.createChatCompletion({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 100,
      });

      const text = openaiResponse.data.choices[0].message.content.trim();

      return res.json({ text });
    } catch (error) {
      console.error("Error fetching from OpenAI:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };

  // Export the functions
  return {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask,
    createTaskWithAI,
    generateTaskDescription,
  };
};
