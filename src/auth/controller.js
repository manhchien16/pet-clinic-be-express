const { successResponse, errorResponse } = require("../common/swapRespose");
const UserService = require("../users/services");

const AuthController = {
  /**
   * Register new user
   */
  async register(req, res) {
    try {
      const result = await UserService.register(req.body);
      
      // Set cookies
      res.cookie("accessToken", result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 1000, // 1 hour
      });
      
      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      return successResponse(res, {
        user: result.user,
        accessToken: result.accessToken,
      }, "User registered successfully", 201);
    } catch (error) {
      if (error.message === "Email already exists") {
        return errorResponse(res, error.message, 400, "EMAIL_EXISTS");
      }
      return errorResponse(res, error.message, 500, "REGISTRATION_ERROR");
    }
  },

  /**
   * Login user
   */
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await UserService.login(email, password);
      
      // Set cookies
      res.cookie("accessToken", result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 1000, // 1 hour
      });
      
      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      return successResponse(res, {
        user: result.user,
        accessToken: result.accessToken,
      }, "Login successful");
    } catch (error) {
      if (error.message === "Invalid email or password") {
        return errorResponse(res, error.message, 401, "INVALID_CREDENTIALS");
      }
      return errorResponse(res, error.message, 500, "LOGIN_ERROR");
    }
  },

  /**
   * Logout user
   */
  async logout(req, res) {
    try {
      await UserService.logout(req.user._id);
      
      // Clear cookies
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");

      return successResponse(res, null, "Logged out successfully");
    } catch (error) {
      return errorResponse(res, error.message, 500, "LOGOUT_ERROR");
    }
  },

  /**
   * Refresh access token
   */
  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.cookies;
      
      if (!refreshToken) {
        return errorResponse(res, "Refresh token is required", 401, "NO_REFRESH_TOKEN");
      }

      const result = await UserService.refreshToken(refreshToken);
      
      // Set new access token cookie
      res.cookie("accessToken", result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 1000, // 1 hour
      });

      return successResponse(res, {
        accessToken: result.accessToken,
      }, "Token refreshed successfully");
    } catch (error) {
      return errorResponse(res, "Invalid refresh token", 401, "INVALID_REFRESH_TOKEN");
    }
  },

  /**
   * Get current user info
   */
  async me(req, res) {
    try {
      const user = await UserService.getById(req.user._id);
      return successResponse(res, user, "User info retrieved successfully");
    } catch (error) {
      return errorResponse(res, error.message, 500, "USER_INFO_ERROR");
    }
  },

  /**
   * Change user password
   */
  async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      const result = await UserService.changePassword(
        req.user._id,
        currentPassword,
        newPassword
      );
      
      return successResponse(res, null, result.message);
    } catch (error) {
      if (error.message === "Current password is incorrect") {
        return errorResponse(res, error.message, 400, "INVALID_PASSWORD");
      }
      return errorResponse(res, error.message, 500, "CHANGE_PASSWORD_ERROR");
    }
  },
};

module.exports = AuthController;
