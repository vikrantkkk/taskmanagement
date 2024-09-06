const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
require("dotenv").config();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");
const reposeHandler = require("./services/responseHandler/send");
const userRoute = require("./routes/userRoute");
const taskRoute = require("./routes/taskRoute");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  
  // Handle incoming notifications
  socket.on("sendNotification", (notification) => {
    io.to(notification.userId).emit("receiveNotification", notification);
  });
  
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(morgan("dev"));
app.use(reposeHandler);


const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log(`MongoDB is connected..🚀`))
  .catch((err) => console.log(err));

app.use("/api/v1/user", userRoute);
app.use("/api/v1/task", taskRoute);

app.use((req, res) => {
  console.log("Route not found...");
  res.status(404).json({ status: false, message: "Route not found..." });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ status: false, message: "Internal Server Error" });
});

server.listen(PORT, () => {
  console.log(`Server is running on port 🚀 ${PORT}`);
});
