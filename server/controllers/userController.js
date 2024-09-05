const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { mailPayload } = require("../services/email/emailPayload");
const { generateOtp } = require("../services/utils/otpGenerator");
const uploadOnCloudinary = require("../services/utils/cloudinaryConfig");

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
    console.log("🚀 ~ exports.registerUser= ~ existingUser:", existingUser)

    if (existingUser) {
      return res.BadRequest({}, "User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = generateOtp();
    const otpExpiresAt = Date.now() + 10 * 60 * 1000;

    const imageLocalPath = req.file?.path;
    console.log("🚀 ~ exports.registerUser= ~ imageLocalPath:", imageLocalPath)

    if (!imageLocalPath) {
      return res.BadRequest({}, "Please upload a profile picture");
    }

    const images = await uploadOnCloudinary(imageLocalPath);
    console.log("🚀 ~ exports.registerUser= ~ images:", images)

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
    const createUserData = JSON.parse(JSON.stringify(newUser));

    let payload = {
      email,
      otp,
      cc: ["vikrantk122896@gmail.com.com"],
    };
    await mailPayload("otp_verification", payload);

    return res.create(
      { ...createUserData, token },
      "user Register successfully"
    );
  } catch (error) {
    console.log(error.message);
    res.InternalError({}, "Internal server error");
  }
};
