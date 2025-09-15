const authService = require('./services');
const emailService = require('../utils/email');
const { successResponse, errorResponse } = require('../common/swapRespose');

const authController = {
  // Register new user
  async register(req, res) {
    try {      
      const result = await authService.register(req.body);
      
      // Send welcome email with verification link
      try {
        const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${result.verificationToken}`;
        await emailService.sendWelcomeEmail(result.user, verificationUrl);
      } catch (emailError) {
        console.error('Welcome email failed:', emailError);
        // Don't fail registration if email fails
      }
      
      return successResponse(
        res, 
        { user: result.user }, 
        'User registered successfully. Please check your email to verify your account.',
        201
      );
    } catch (error) {
      console.error('Register error:', error);
      return errorResponse(res, error.message, 400, 'REGISTRATION_FAILED');
    }
  },

  // Login user
  async login(req, res) {
    try {      
      const { email, password } = req.body;
      const deviceInfo = {
        userAgent: req.get('User-Agent'),
        ip: req.ip || req.connection.remoteAddress
      };

      const result = await authService.login(email, password, deviceInfo);
      
      return successResponse(
        res, 
        result, 
        'Login successful'
      );
    } catch (error) {
      console.error('Login error:', error);
      
      // Determine error code based on message
      let errorCode = 'LOGIN_FAILED';
      if (error.message.includes('locked')) {
        errorCode = 'ACCOUNT_LOCKED';
      } else if (error.message.includes('Invalid email or password')) {
        errorCode = 'INVALID_CREDENTIALS';
      } else if (error.message.includes('deactivated')) {
        errorCode = 'ACCOUNT_DEACTIVATED';
      }
      
      return errorResponse(res, error.message, 401, errorCode);
    }
  },

  // Logout user
  async logout(req, res) {
    try {
      const jwtId = req.user.jwtId; // Set by auth middleware
      
      await authService.logout(jwtId);
      
      return successResponse(res, null, 'Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
      return errorResponse(res, error.message, 400, 'LOGOUT_FAILED');
    }
  },

  // Forgot password
  async forgotPassword(req, res) {
    try {
      
      const resetToken = await authService.forgotPassword(req.body.email);
      
      // Send password reset email
      try {
        const User = require('../users/model/user');
        const user = await User.findOne({ email: req.body.email });
        if (user) {
          const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
          await emailService.sendPasswordResetEmail(user, resetUrl);
        }
      } catch (emailError) {
        console.error('Password reset email failed:', emailError);
        // Don't fail the request if email fails
      }
      
      return successResponse(
        res, 
        null, 
        'Password reset token sent to email'
      );
    } catch (error) {
      console.error('Forgot password error:', error);
      return errorResponse(res, error.message, 404, 'FORGOT_PASSWORD_FAILED');
    }
  },

  // Reset password
  async resetPassword(req, res) {
    try {      
      const { token } = req.params;
      const { password } = req.body;
      
      const user = await authService.resetPassword(token, password);
      
      // Send password change notification
      try {
        await emailService.sendPasswordChangeNotification(user);
      } catch (emailError) {
        console.error('Password change notification failed:', emailError);
      }
      
      return successResponse(
        res, 
        null, 
        'Password reset successful'
      );
    } catch (error) {
      console.error('Reset password error:', error);
      return errorResponse(res, error.message, 400, 'PASSWORD_RESET_FAILED');
    }
  },

  // Verify email
  async verifyEmail(req, res) {
    try {
      const { token } = req.params;
      
      const user = await authService.verifyEmail(token);
      
      // Send verification success email
      try {
        await emailService.sendEmailVerificationSuccess(user);
      } catch (emailError) {
        console.error('Email verification success notification failed:', emailError);
      }
      
      return successResponse(
        res, 
        null, 
        'Email verified successfully'
      );
    } catch (error) {
      console.error('Email verification error:', error);
      return errorResponse(res, error.message, 400, 'EMAIL_VERIFICATION_FAILED');
    }
  },

  // Refresh token
  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.cookies;
      
      if (!refreshToken) {
        return errorResponse(res, "Refresh token is required", 401, "NO_REFRESH_TOKEN");
      }

      const result = await authService.refreshToken(refreshToken);
      
      return successResponse(res, {
        accessToken: result.accessToken,
      }, "Token refreshed successfully");
    } catch (error) {
      return errorResponse(res, "Invalid refresh token", 401, "INVALID_REFRESH_TOKEN");
    }
  }
};
module.exports = authController;
