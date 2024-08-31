const express = require("express");
const next = require("next");
const dotenv = require("dotenv");
// const connectDB = require("./config/db"); // Adjusted path
const cors = require("cors");

dotenv.config();
// connectDB();

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev, dir: "../client" }); // Point Next.js to the client folder
const handle = nextApp.getRequestHandler();

const app = express();
app.use(cors());
app.use(express.json());

// API routes

app.use("/api/users", require("./routes/userRoutes")); // Adjusted path
// app.use("/api/tasks", require("./routes/taskRoutes")); // Adjusted path

// Next.js handling
nextApp.prepare().then(() => {
  app.get("*", (req, res) => {
    return handle(req, res);
  });

  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
