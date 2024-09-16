// Load environment variables using dotenv
const dotenv = require("dotenv");

// Dynamically load the appropriate .env file based on the environment
if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: ".env.production" });
} else {
  dotenv.config({ path: ".env.local" });
}

// Import necessary packages
const express = require("express");
const mongoose = require("mongoose");
const next = require("next");
const passport = require("./config/passportConfig");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");
const productivityRoutes = require("./routes/productivityRoutes");

// Initialize Next.js application
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev, dir: "./client" }); // Ensure this path is relative to where server.js is located
const handle = nextApp.getRequestHandler();

// Initialize Express app and server
const app = express();
const http = require("http");
const server = http.createServer(app);

// Initialize Socket.IO with the server
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: dev ? "http://localhost:3000" : "https://taskstars.onrender.com", // Allow frontend URL based on environment
    credentials: true,
  },
});

// Database Connection
connectDB();

// Middleware
app.use(
  cors({
    origin: dev ? "http://localhost:3000" : "https://taskstars.onrender.com", // Allow frontend URL based on environment
    credentials: true,
  })
);
app.use(express.json());
app.use(passport.initialize());

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Test Route
app.get("/test", (req, res) => {
  res.json({ message: "API is working properly!" });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes(io)); // Pass io to task routes
app.use("/api/productivity", productivityRoutes);

// Next.js request handling
nextApp
  .prepare()
  .then(() => {
    app.get("*", (req, res) => handle(req, res));

    // Start the server
    const PORT = process.env.PORT || 8080;
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("Error preparing Next.js app:", err));
