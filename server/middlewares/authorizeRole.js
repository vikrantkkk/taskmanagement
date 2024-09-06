const authorizeRoles = (roles) => {
  return (req, res, next) => {
    console.log("🚀 ~ return ~ req.user.role:", req.user.role);
    if (!req.user || !roles.includes(req.user.role)) {
      return res.UnAuthorized({}, "Access denied. Insufficient permissions.");
    }
    next();
  };
};

module.exports = authorizeRoles;
