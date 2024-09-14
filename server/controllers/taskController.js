const Task = require("../models/Task");
const User = require("../models/User");
const { Configuration, OpenAIApi } = require("openai");
const OpenAI = require("openai"); // Require the OpenAI module
const chrono = require('chrono-node');

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


// Create a new task using OpenAI
exports.createTaskWithAI = async (req, res) => {
  try {
    const { taskDescription, priority = "Medium", tags = [] } = req.body;

    console.log("Received task description:", taskDescription);

    if (!taskDescription) {
      return res.status(400).json({ message: "Task description is required." });
    }

    console.log("API Key:", process.env.OPENAI_API_KEY);

    // Initialize OpenAI API using the correct syntax
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    console.log("OpenAI API initialized:", openai);

    // Send request to OpenAI with a prompt to generate both a title and a description
    const openaiResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Generate a task title and a short description based on this input: "${taskDescription}". If applicable, include a deadline as "Deadline: [actual date or relative expression]" by interpreting any relative date expressions (like "tomorrow", "next week") into natural language. Do not use "[date]", instead give the date in a readable format.`,
        },
      ],
      max_tokens: 150,
    });

    const gptOutput = openaiResponse.choices[0].message.content.trim();
    console.log("OpenAI response:", gptOutput);

    // Parse OpenAI response for title, description, and deadline
    const titleMatch = gptOutput.match(/Title:\s*(.+)/);
    const descriptionMatch = gptOutput.match(/Description:\s*(.+)/);
    const deadlineMatch = gptOutput.match(/Deadline:\s*(.+)/);

    const title = titleMatch ? titleMatch[1].trim() : "Generated Task";
    const description = descriptionMatch
      ? descriptionMatch[1].trim()
      : "No description provided.";

    // Check if the deadline is valid or should be null
    const deadlineString = deadlineMatch ? deadlineMatch[1].trim() : null;
    let deadline = null;

    if (deadlineString && deadlineString.toLowerCase() !== "no deadline") {
      // Use chrono-node to parse the natural language date
      const parsedDate = chrono.parseDate(deadlineString);
      if (parsedDate) {
        deadline = parsedDate; // Assign the parsed date if it's valid
      } else {
        console.warn("Invalid deadline provided by OpenAI:", deadlineString);
      }
    }

    console.log(
      "Parsed title:",
      title,
      "Parsed description:",
      description,
      "Parsed deadline:",
      deadline
    );

    // Create a new task and save it to the database
    const task = new Task({
      title: title,
      description: description,
      deadline: deadline, // This could be a valid date or null
      priority: priority || "Medium",
      tags: Array.isArray(tags) ? tags : [],
      user: req.user.id,
    });

    await task.save();
    console.log("Task created successfully:", task);
    res.status(201).json(task);
  } catch (error) {
    console.error("Error creating task:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};