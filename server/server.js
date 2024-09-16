const dotenv = require("dotenv");

if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: ".env.production" });
} else {
  dotenv.config({ path: ".env.local" });
}

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

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev, dir: "./client" }); // Ensure this points to your Next.js app directory
const handle = nextApp.getRequestHandler();

const app = express();
const http = require("http");
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "https://taskstars.onrender.com",
    credentials: true,
  },
});

connectDB();

app.use(
  cors({
    origin: "https://taskstars.onrender.com",
    credentials: true,
  })
);
app.use(express.json());
app.use(passport.initialize());

// Your Express routes
app.get("/test", (req, res) => {
  res.json({ message: "API is working properly!" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes(io));
app.use("/api/productivity", productivityRoutes);

// Socket.io connection
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Prepare Next.js and handle all other routes
nextApp
  .prepare()
  .then(() => {
    // Forward all unmatched requests to Next.js
    app.all("*", (req, res) => handle(req, res));

    const PORT = process.env.PORT || 8080;
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("Error preparing Next.js app:", err));
