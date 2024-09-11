const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");
const { Server } = require("socket.io"); // New
const http = require("http"); // New
const reposeHandler = require("./services/responseHandler/send");
const userRoute = require("./routes/userRoute");
const taskRoute = require("./routes/taskRoute");
require("./services/cron/cronSheduleReminder");

const app = express();
const server = http.createServer(app); // New
const io = new Server(server, {
  // New
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(reposeHandler);

// MongoDB connection
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log(`MongoDB is connected..🚀`))
  .catch((err) => console.log(err));

app.use("/api/v1/user", userRoute);
app.use("/api/v1/task", taskRoute);

// Handle Socket.io connection
io.on("connection", (socket) => {
  console.log("New client connected: ", socket.id);

  // Listen for disconnect event
  socket.on("disconnect", () => {
    console.log("Client disconnected", socket.id);
  });
});

// Expose io to routes
app.set("io", io);

server.listen(PORT, () => {
  console.log(`Server is running on port 🚀 ${PORT}`);
});
