const express = require("express");
const { registerUser, verifyOtp } = require("../controllers/userController");
const { upload } = require("../middlewares/uploadFileMiddleware"); // Make sure this path is correct
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", upload.single("images"), registerUser);
router.post("/verify-otp",authMiddleware, verifyOtp);

module.exports = router;
