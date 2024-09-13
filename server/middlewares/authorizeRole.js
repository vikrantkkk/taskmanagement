const authorizeRoles = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.UnAuthorized({}, "Access denied. Insufficient permissions.");
    }
    next();
  };
};

module.exports = authorizeRoles;
