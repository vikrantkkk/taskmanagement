const express = require("express");
const { registerUser } = require("../controllers/userController");
const { upload } = require("../middlewares/uploadFileMiddleware"); // Make sure this path is correct

const router = express.Router();

router.post("/register", upload.single("images"), registerUser);

module.exports = router;
