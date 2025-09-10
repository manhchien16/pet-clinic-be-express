const { resError } = require("../common/swapRespose");
const loginService = require("./services");

// Middleware to verify the JWT token
const verifyToken = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json(resError('Access denied. No token provided.', 401));
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json(resError('Access denied. No token provided.', 401));
    }

    // Verify token
    const decoded = loginService.verifyToken(token);
    
    // Set user in request
    req.user = decoded;
    
    next();
  } catch (error) {
    return res.status(401).json(resError('Invalid token.', 401));
  }
};

// Middleware to check if user has admin role
const isAdmin = (req, res, next) => {
  try {
    if (req.user.roleId !== 'admin') {
      return res.status(403).json(resError('Access denied. Admin role required.', 403));
    }
    
    next();
  } catch (error) {
    return res.status(500).json(resError(error));
  }
};

module.exports = {
  verifyToken,
  isAdmin
};
