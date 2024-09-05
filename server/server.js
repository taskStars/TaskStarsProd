// Load environment variables
require("dotenv").config();

// Import necessary packages
const express = require("express");
const mongoose = require("mongoose");
const next = require("next");
const passport = require("./config/passportConfig"); // Import Passport configuration
const cors = require("cors");
const connectDB = require("./config/db"); // Import your custom DB connection
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes"); // Task routes
const productivityRoutes = require("./routes/productivityRoutes"); // Import Productivity routes

// Initialize Express app
const app = express();

// Database Connection
connectDB(); // Connect to MongoDB using your custom connection file

// Next.js setup
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev, dir: "../client" }); // Ensure this path is correct
const handle = nextApp.getRequestHandler();

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000", // Allow frontend URL
    credentials: true, // If using cookies for sessions
  })
); // Add CORS middleware to prevent CORS issues
app.use(express.json());
app.use(passport.initialize()); // Initialize Passport middleware

// Test Route - Keep this above the Next.js handler
app.get("/test", (req, res) => {
  res.json({ message: "API is working properly!" });
});

// Routes
app.use("/api/auth", authRoutes); // Authentication routes
app.use("/api/users", userRoutes); // User routes
app.use("/api/tasks", taskRoutes); // Task routes
app.use("/api", productivityRoutes); // Register Productivity routes

// Next.js handling
nextApp
  .prepare()
  .then(() => {
    // Handle all other routes with Next.js
    app.get("*", (req, res) => {
      return handle(req, res);
    });

    // Start the server
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Error preparing Next.js app:", err);
  });
