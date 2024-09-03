// server.js
const express = require("express");
const next = require("next");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");

dotenv.config(); // Load environment variables

// Connect to the database
connectDB();

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev, dir: "../client" }); 
const handle = nextApp.getRequestHandler();

const app = express(); // Initialize Express

// Middlewares
app.use(cors());
app.use(express.json());

// API routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));

// Next.js handling
// nextApp.prepare().then(() => {
//   app.get("*", (req, res) => {
//     return handle(req, res);
//   });

  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

