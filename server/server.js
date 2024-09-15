// Load environment variables
require("dotenv").config();

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

// Initialize Express app and server
const app = express();
const http = require("http");
const server = http.createServer(app);

// Initialize Socket.IO with the server
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Allow frontend URL
    credentials: true,
  },
});

// Database Connection
connectDB();

// Next.js setup
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev, dir: "../client" });
const handle = nextApp.getRequestHandler();

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
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

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes(io)); // Pass io to task routes
app.use("/api/productivity", productivityRoutes);

// Next.js handling
nextApp
  .prepare()
  .then(() => {
    app.get("*", (req, res) => handle(req, res));

    // Start the server
    const PORT = process.env.PORT || 8080;
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("Error preparing Next.js app:", err));
