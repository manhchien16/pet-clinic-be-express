const { verifyAccessToken } = require("../utils/jwt");
const { errorResponse } = require("../common/swapRespose");
const User = require("../users/model/user");

/**
 * Middleware để verify JWT token
 */
const authenticateToken = async (req, res, next) => {
  try {
    let token;

    // Lấy token từ header Authorization hoặc cookie
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    } else if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return errorResponse(res, "Access token is required", 401, "NO_TOKEN");
    }

    // Verify token
    const decoded = verifyAccessToken(token);
    
    // Tìm user từ database
    const user = await User.findById(decoded.userId).select("+refreshToken");
    if (!user || !user.isActive) {
      return errorResponse(res, "User not found or inactive", 401, "USER_NOT_FOUND");
    }

    // Attach user info vào request object
    req.user = user;
    next();
  } catch (error) {
    return errorResponse(res, "Invalid or expired token", 401, "INVALID_TOKEN");
  }
};

/**
 * Middleware để check role permissions
 */
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, "Authentication required", 401, "AUTH_REQUIRED");
    }

    if (!roles.includes(req.user.roleId)) {
      return errorResponse(res, "Access denied", 403, "ACCESS_DENIED");
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
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    } else if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (token) {
      const decoded = verifyAccessToken(token);
      const user = await User.findById(decoded.userId);
      if (user && user.isActive) {
        req.user = user;
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
