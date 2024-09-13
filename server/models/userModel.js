const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    profilePic: { type: String, default: null },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    isVerified: { type: Boolean, default: false }, 
    otp: { type: String }, 
    otpExpiresAt: { type: Date }, 
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
