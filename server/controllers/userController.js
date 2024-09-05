const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { mailPayload } = require("../services/email/emailPayload");
const { generateOtp } = require("../services/utils/otpGenerator");
const uploadOnCloudinary = require("../services/utils/cloudinaryConfig");
const cookie = require("cookie");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\d{10}$/;
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

exports.registerUser = async (req, res) => {
  try {
    const { firstName, lastName, phone, email, password } = req.body;

    if (!(firstName && lastName && phone && email && password)) {
      return res.BadRequest({}, "missing required fields");
    }
    if (!emailRegex.test(email)) {
      return res.BadRequest({}, "invalid email format");
    }
    if (!phoneRegex.test(phone)) {
      return res.BadRequest({}, "invalid phone number format");
    }
    if (!passwordRegex.test(password)) {
      return res.BadRequest({}, "invalid password format");
    }
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });

    if (existingUser) {
      return res.BadRequest({}, "User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = generateOtp();
    const otpExpiresAt = Date.now() + 10 * 60 * 1000;

    const imageLocalPath = req.file?.path;

    if (!imageLocalPath) {
      return res.BadRequest({}, "Please upload a profile picture");
    }

    const images = await uploadOnCloudinary(imageLocalPath);

    if (!images.url) {
      return res.BadRequest({}, "Failed to upload image");
    }

    const newUser = await User.create({
      firstName,
      lastName,
      phone,
      email,
      password: hashedPassword,
      profilePic: images.url,
      otp,
      otpExpiresAt,
    });

    const token = jwt.sign(
      {
        userId: newUser._id,
        role: "user",
        email: email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.cookie("token", token, { httpOnly: true });

    let payload = {
      email,
      otp,
      cc: ["vikrantk122896@gmail.com.com"],
    };
    await mailPayload("otp_verification", payload);

    return res.Create(
      newUser,
      "User registered successfully. Please verify OTP."
    );
  } catch (error) {
    console.log(error.message);
    res.InternalError({}, "Internal server error");
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { otp } = req.body;
    const { userId } = req.user;
    if (!otp) {
      return res.BadRequest({}, "OTP is required");
    }
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.NotFound({}, "User not found");
    }
    if (user.otp !== otp) {
      return res.BadRequest({}, "Invalid OTP");
    }

    if (user.otpExpiresAt < Date.now()) {
      return res.BadRequest({}, "OTP has expired");
    }

    let payload = {
      email: user.email,
      otp,
      cc: ["vikrantk122896@gmail.com.com"],
    };
    await mailPayload("create_account", payload);

    user.isVerified = true;
    // Clear OTP after successful verification
    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    return res.Ok(user, "OTP verified successfully. User is now active.");
  } catch (error) {
    console.log(error);
    res.InternalError({}, "Internal server error");
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      return res.BadRequest({}, "Email and password are required");
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.NotFound({}, "User not found");
    }

    // Validate password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.BadRequest({}, "Invalid password");
    }

    // Generate OTP and expiration time
    const otp = generateOtp();
    const otpExpiresAt = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes

    // Save OTP and expiration to the user object
    user.otp = otp;
    user.otpExpiresAt = otpExpiresAt;
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: "user", email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Set the token in a cookie
    res.cookie("token", token, { httpOnly: true });

    // Send OTP to user's email
    const payload = {
      email,
      otp,
      cc: ["vikrantk122896@gmail.com"],
    };
    await mailPayload("otp_verification", payload);

    return res.Ok(user, "Login successful. OTP sent to your email.");
  } catch (error) {
    console.log(error);
    return res.InternalError({}, "Internal server error");
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.NotFound({}, "User not found");
    }

    return res.Ok(user, "User profile retrieved successfully");
  } catch (error) {
    console.log(error.message);
    res.InternalError({}, "Internal server error");
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const { userId } = req.user;
    const { firstName, lastName, phone, email } = req.body;

    const imageLocalPath = req.file?.path;

    if (!imageLocalPath) {
      return res.BadRequest({}, "Please upload a profile picture");
    }

    const images = await uploadOnCloudinary(imageLocalPath);

    if (!images.url) {
      return res.BadRequest({}, "Failed to upload image");
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, phone, email, profilePic: images.url },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.NotFound({}, "User not found");
    }

    const payload = {
      firstName,
      lastName,
      phone,
      email,
      cc: ["vikrantk122896@gmail.com"],
    };
    await mailPayload("profile_update", payload);

    return res.Ok(updatedUser, "Profile updated successfully");
  } catch (error) {
    console.log(error.message);
    res.InternalError({}, "Internal server error");
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { userId } = req.user;
    const { oldPassword, newPassword } = req.body;

    if (!(oldPassword && newPassword)) {
      return res.BadRequest({}, "Old and new passwords are required");
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.NotFound({}, "User not found");
    }

    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordMatch) {
      return res.ForBidden({}, "Incorrect old password");
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    const payload = {
      email: user.email,
      cc: ["vikrantk122896@gmail.com"],
    };
    await mailPayload("change_password", payload);

    return res.Ok(user, "Password changed successfully");
  } catch (error) {
    console.error("Change password error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
