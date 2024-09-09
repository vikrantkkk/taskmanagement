const express = require("express");
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
const { upload } = require("../middlewares/uploadFileMiddleware"); // Make sure this path is correct
const authMiddleware = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/authorizeRole");

const router = express.Router();

router.post("/register", upload.single("images"), registerUser);
router.post("/verify-otp", authMiddleware, verifyOtp);
router.post("/login", loginUser);
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
  authorizeRoles(["admin"]),
  deleteUser
);
router.post("/logout", logoutUser);

module.exports = router;
