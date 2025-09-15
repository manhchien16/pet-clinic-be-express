const authService = require('../auth/services');
const { errorResponse } = require('../common/swapRespose');
const User = require('../users/model/user');

/**
 * Middleware để verify JWT token
 */
const authenticateToken = async (req, res, next) => {
  try {
    let token;

    // Lấy token từ header Authorization hoặc cookie
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return errorResponse(res, 'Access token is required', 401, 'NO_TOKEN');
    }

    // Verify token và lấy user
    const user = await authService.validateUserFromToken(token);
    
    // Attach user info vào request object
    req.user = user;
    next();
  } catch (error) {
    return errorResponse(res, error.message, 401, 'INVALID_TOKEN');
  }
};

/**
 * Middleware để check role permissions
 */
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 'Authentication required', 401, 'AUTH_REQUIRED');
    }

    if (!roles.includes(req.user.role)) {
      return errorResponse(res, 'Access denied', 403, 'ACCESS_DENIED');
    }

    next();
  };
};

/**
 * Optional authentication - không throw error nếu không có token
 */
const optionalAuth = async (req, res, next) => {
  try {
    let token;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (token) {
      try {
        const user = await authService.validateUserFromToken(token);
        req.user = user;
      } catch (error) {
        // Ignore errors for optional auth
      }
    }

    next();
  } catch (error) {
    // Ignore errors for optional auth
    next();
  }
};

module.exports = {
  authenticateToken,
  authorizeRoles,
  optionalAuth,
};
