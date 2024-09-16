const Task = require("../models/Task");
const User = require("../models/User");
const { Configuration, OpenAIApi } = require("openai");
const OpenAI = require("openai");
const chrono = require("chrono-node");


module.exports = (io) => {
  
  const createTask = async (req, res) => {
    try {
      const task = new Task({
        ...req.body,
        user: req.user.id,
      });

      await task.save();

      
      io.emit("task_added", task);

      res.status(201).json(task);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  
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

      
      io.emit("task_updated", task);

      res.status(200).json(task);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  
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

      
      io.emit("task_deleted", req.params.id);

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  
  const createTaskWithAI = async (req, res) => {
    try {
      const { taskDescription, priority = "Medium", tags = [] } = req.body;

      if (!taskDescription) {
        return res
          .status(400)
          .json({ message: "Task description is required." });
      }

      
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      
      const openaiResponse = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `Generate a task title and a short description based on this input: "${taskDescription}". If applicable, include a deadline as "Deadline: [actual date or relative expression]" by interpreting any relative date expressions (like "tomorrow", "next week") into natural language.`,
          },
        ],
        max_tokens: 150,
      });

      const gptOutput = openaiResponse.choices[0].message.content.trim();
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
        const parsedDate = chrono.parseDate(deadlineString);
        if (parsedDate) {
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
      io.emit("task_added", task); 
      res.status(201).json(task);
    } catch (error) {
      console.error("Error creating task:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  return {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask,
    createTaskWithAI,
  };
};
