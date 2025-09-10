const { resError } = require("../common/swapRespose");
const loginService = require("./services");

const LoginController = {
  // Login user
  async login(req, res) {
    try {
      const result = await loginService.login(req.body);
      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result
      });
    } catch (error) {
      res.status(401).json(resError(error, 401));
    }
  },

  // Refresh token
  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;
      const result = await loginService.refreshToken(refreshToken);
      
      res.status(200).json({
        success: true,
        message: 'Token refreshed successfully',
        data: result
      });
    } catch (error) {
      res.status(401).json(resError(error, 401));
    }
  },

  // Logout user
  async logout(req, res) {
    try {
      const userId = req.user.userId;
      await loginService.logout(userId);
      
      res.status(200).json({
        success: true,
        message: 'Logout successful'
      });
    } catch (error) {
      res.status(500).json(resError(error));
    }
  }
};

module.exports = LoginController;
