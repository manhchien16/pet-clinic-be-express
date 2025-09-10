const jwt = require("jsonwebtoken");

/**
 * Generate access token (1 hour expiry)
 */
const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET || "your-secret-key", {
    expiresIn: "1h", // 1 tiếng
  });
};

/**
 * Generate refresh token (7 days expiry)
 */
const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET || "your-refresh-secret", {
    expiresIn: "7d", // 7 ngày
  });
};

/**
 * Verify access token
 */
const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
  } catch (error) {
    throw new Error("Invalid access token");
  }
};

/**
 * Verify refresh token
 */
const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET || "your-refresh-secret");
  } catch (error) {
    throw new Error("Invalid refresh token");
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
