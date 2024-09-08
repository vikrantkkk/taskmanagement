const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");
const reposeHandler = require("./services/responseHandler/send");
const userRoute = require("./routes/userRoute");
const taskRoute = require("./routes/taskRoute");
const app = express();

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


app.listen(PORT, () => {
  console.log(`Server is running on port 🚀 ${PORT}`);
});
