const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lasstName: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    teams: [{ type: mongoose.Schema.Types.ObjectId, ref: "Team" }],
    projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
    googleId: { type: String }, // For Google authentication
    isVerified: { type: Boolean, default: false }, // OTP verification status
    otp: { type: String }, // OTP code
    otpExpiresAt: { type: Date }, // OTP expiration time
  },
  { timestamps: true }
);

userSchema.methods.generateOtp = function () {
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  this.otp = otp;
  this.otpExpiresAt = Date.now() + 10 * 60 * 1000; // Expires in 10 minutes
  return otp;
};

userSchema.methods.validateOtp = function (enteredOtp) {
  if (this.otpExpiresAt < Date.now()) {
    return false; // OTP expired
  }
  return this.otp === enteredOtp;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
