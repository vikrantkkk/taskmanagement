const express = require("express");
const {
  registerUser,
  verifyOtp,
  getUserProfile,
  updateUserProfile,
  changePassword,
  loginUser,
} = require("../controllers/userController");
const { upload } = require("../middlewares/uploadFileMiddleware"); // Make sure this path is correct
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", upload.single("images"), registerUser);
router.post("/verify-otp", authMiddleware, verifyOtp);
router.post("/login", authMiddleware, loginUser);
router.get("/get-user-profile", authMiddleware, getUserProfile);
router.put(
  "/update-user-profile",
  authMiddleware,
  upload.single("images"),
  updateUserProfile
);
router.post("/change-password", authMiddleware, changePassword);

module.exports = router;
