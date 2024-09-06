// authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.ForBidden({}, "No token provided");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user object to req
    console.log("🚀 ~ authMiddleware ~ req.user:", req.user.role);
    next();
  } catch (error) {
    return res.ForBidden({}, "Invalid token");
  }
};

module.exports = authMiddleware;
