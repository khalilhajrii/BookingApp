const checkRole = (requiredRole) => {
    return (req, res, next) => {
      if (!req.user || !req.user.role) {
        return res.status(403).json({ message: 'User role not found' });
      }
  
      const userRole = req.user.role.name;
  
      if (userRole !== requiredRole) {
        return res.status(403).json({ message: 'Access denied' });
      }
  
      next();
    };
  };
  
  module.exports = checkRole;