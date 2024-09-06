const authorizeRoles = (roles) => {
  return (req, res, next) => {
    console.log("🚀 ~ return ~ req.user.role:", req.user.role);
    if (!req.user || !roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Access denied. Insufficient permissions." });
    }
    next();
  };
};

module.exports = authorizeRoles;
