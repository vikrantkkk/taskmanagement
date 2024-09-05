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

    let payload = {
      email,
      otp,
      cc: ["vikrantk122896@gmail.com.com"],
    };
    await mailPayload("otp_verification", payload);

    res.cookie("token", token, { httpOnly: true });

    return res.create(
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
    const user = await User.findById(userId);
    if (!user) {
      return res.NotFound({}, "User not found");
    }
    if (user.otp !== otp) {
      return res.BadRequest({}, "Invalid OTP");
    }

    if (user.otpExpiresAt < Date.now()) {
      return res.BadRequest({}, "OTP has expired");
    }

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
