const express = require("express");
const http = require("http");
const { initializeSocket } = require("./socket");
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
initializeSocket(server); 

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

app.listen(PORT, () => {
  console.log(`Server is running on port 🚀 ${PORT}`);
});
