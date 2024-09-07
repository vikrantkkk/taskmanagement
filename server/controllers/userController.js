const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { mailPayload } = require("../services/email/emailPayload");
const { generateOtp } = require("../services/utils/otpGenerator");
const uploadOnCloudinary = require("../services/utils/cloudinaryConfig");
const cookie = require("cookie");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!(name && email && password)) {
      return res.BadRequest({}, "missing required fields");
    }
    if (!emailRegex.test(email)) {
      return res.BadRequest({}, "invalid email format");
    }
    if (!passwordRegex.test(password)) {
      return res.BadRequest({}, "invalid password format");
    }
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.BadRequest({}, "User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = generateOtp();
    const otpExpiresAt = Date.now() + 10 * 60 * 1000;

    const imageLocalPath = req.file?.path;

    let imageUrl = null;

    if (imageLocalPath) {
      const images = await uploadOnCloudinary(imageLocalPath);

      if (!images.url) {
        return res.BadRequest({}, "Failed to upload image");
      }

      imageUrl = images.url;
    }

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      profilePic: imageUrl,
      otp,
      otpExpiresAt,
    });

    const token = jwt.sign(
      {
        userId: newUser._id,
        role: newUser.role,
        email: email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });

    let payload = {
      email,
      otp,
      cc: ["vikrantk122896@gmail.com.com"],
    };
    await mailPayload("otp_verification", payload);
    const createUserData = JSON.parse(JSON.stringify(newUser));
    return res.Create(
      { ...createUserData, token },
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

    return res.Ok({ user }, "OTP verified successfully. User is now active.");
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
      { userId: user._id, role: user.role, email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // Set to true in production when using HTTPS
      sameSite: "Strict", // Allows cookies to be sent across different ports
      maxAge: 24 * 60 * 60 * 1000, // Cookie expiration time (1 day)
    });

    // Send OTP to user's email
    const payload = {
      email,
      otp,
      cc: ["vikrantk122896@gmail.com"],
    };
    await mailPayload("otp_verification", payload);
    const loginUserData = JSON.parse(JSON.stringify(user));
    return res.Ok(
      { ...loginUserData, token },
      "Login successful. OTP sent to your email."
    );
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
    const { name, email } = req.body;

    const imageLocalPath = req.file?.path;

    let imageUrl = null;

    if (imageLocalPath) {
      const images = await uploadOnCloudinary(imageLocalPath);

      if (!images.url) {
        return res.BadRequest({}, "Failed to upload image");
      }

      imageUrl = images.url;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, profilePic: imageUrl },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.NotFound({}, "User not found");
    }

    const payload = {
      name,
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

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.BadRequest({}, "Email is required");
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.NotFound({}, "User not found");
    }

    // Generate OTP and expiration time
    const otp = generateOtp();
    const otpExpiresAt = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes

    // Save OTP and expiration to the user object
    user.otp = otp;
    user.otpExpiresAt = otpExpiresAt;
    await user.save();

    // Send OTP via email
    const payload = {
      email: user.email,
      otp,
      cc: ["vikrantk122896@gmail.com"], // Adjust CC as per your needs
    };
    await mailPayload("otp_verification", payload);

    return res.Ok({}, "OTP sent to your email. Please check your inbox.");
  } catch (error) {
    console.log(error.message);
    res.InternalError({}, "Internal server error");
  }
};

// Verify OTP and reset password controller
exports.resetPassword = async (req, res) => {
  try {
    const { otp, newPassword } = req.body;

    if (!(otp && newPassword)) {
      return res.BadRequest({}, "OTP and new password are required");
    }

    // Find the user by OTP
    const user = await User.findOne({ otp });

    if (!user) {
      return res.BadRequest({}, "Invalid OTP");
    }

    // Check if OTP has expired
    if (user.otpExpiresAt < Date.now()) {
      return res.BadRequest({}, "OTP has expired");
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password and clear OTP fields
    user.password = hashedPassword;
    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    let payload = {
      email: user.email,
    };
    await mailPayload("password_reset_confirmation", payload);

    return res.Ok(user, "Password has been reset successfully");
  } catch (error) {
    console.log(error.message);
    res.InternalError({}, "Internal server error");
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.NotFound({}, "User not found");
    }

    // Delete the user
    await User.findByIdAndDelete(userId);

    let payload = {
      email: user.email,
    };
    await mailPayload("account_delete", payload);

    return res.Ok(user, "User deleted successfully");
  } catch (error) {
    console.log(error.message);
    res.InternalError({}, "Internal server error");
  }
};
