const express = require("express");
const rateLimit = require('express-rate-limit');
const {
  registerUser,
  verifyOtp,
  getUserProfile,
  updateUserProfile,
  changePassword,
  loginUser,
  forgotPassword,
  resetPassword,
  deleteUser,
  logoutUser,
  getAllUsers,
} = require("../controllers/userController");
const { upload } = require("../middlewares/uploadFileMiddleware"); 
const authMiddleware = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/authorizeRole");

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 10,
  message: "Too many login attempts, please try again after 15 minutes"
});

router.post("/register", upload.single("images"), registerUser);
router.post("/verify-otp", authMiddleware, verifyOtp);
router.post("/login",loginLimiter, loginUser);
router.get("/get-user-profile", authMiddleware, getUserProfile);
router.get("/get-all-user", getAllUsers);
router.put(
  "/update-user-profile",
  authMiddleware,
  upload.single("images"),
  updateUserProfile
);
router.post("/change-password", authMiddleware, changePassword);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.delete(
  "/delete-user/:userId",
  authMiddleware,
  authorizeRoles(["admin","user"]),
  deleteUser
);
router.post("/logout", logoutUser);

module.exports = router;
