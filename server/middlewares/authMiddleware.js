const jwt = require("jsonwebtoken")
const authMiddleware = async (req,res,next) => {
  const token = req.cookies.token;
  console.log("🚀 ~ authMiddleware ~ token:", token)
  try {
    if (token) {
      const payload =  jwt.verify(token, process.env.JWT_SECRET);
      req.user = payload;
      return next();
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = authMiddleware;
