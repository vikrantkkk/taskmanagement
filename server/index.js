const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const reposeHandler = require("./services/responseHandler/send");
const app = express();
dotenv.config();

app.use(bodyParser.json());
app.use(cors());
app.use(reposeHandler);
//log request in console..
app.use(morgan("dev"));

const PORT = 3000 || process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log(`mongodb is connected..🚀`))
  .catch((err) => console.log(err));

app.use((req, res) => {
  console.log("Route not found...");
  res.json({ status: false, message: "Route not found..." });
});

app.listen(PORT, () => {
  console.log(`Server is running on port 🚀 ${PORT}`);
});
