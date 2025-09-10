const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Login = require('./model/login');
const User = require('../users/model/user');
const { validateObject } = require("../common/validateValues");

// Validation rules
const loginValidationRules = {
  username: {
    required: true,
    type: 'string'
  },
  password: {
    required: true,
    type: 'string'
  }
};

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'pet-clinic-secret-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'pet-clinic-refresh-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

const loginService = {
  // Login user
  login: async (credentials) => {
    try {
      // Validate login data
      validateObject(credentials, loginValidationRules);

      // Find user by username
      const loginUser = await Login.findOne({ username: credentials.username });
      if (!loginUser) {
        throw new Error('Invalid username or password');
      }

      // Validate password
      const validPassword = await bcrypt.compare(credentials.password, loginUser.password);
      if (!validPassword) {
        throw new Error('Invalid username or password');
      }

      // Find user details
      const user = await User.findById(loginUser.userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Generate JWT token
      const accessToken = jwt.sign(
        { 
          userId: user._id,
          username: loginUser.username,
          roleId: user.roleId 
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      // Generate refresh token
      const refreshToken = jwt.sign(
        { 
          userId: user._id,
          username: loginUser.username
        },
        JWT_REFRESH_SECRET,
        { expiresIn: JWT_REFRESH_EXPIRES_IN }
      );

      // Update last login and refresh token
      loginUser.lastLogin = new Date();
      loginUser.refreshToken = refreshToken;
      await loginUser.save();

      return {
        userId: user._id,
        username: loginUser.username,
        email: user.email,
        fullName: user.fullName,
        roleId: user.roleId,
        accessToken,
        refreshToken
      };
    } catch (error) {
      throw error;
    }
  },

  // Refresh token
  refreshToken: async (refreshToken) => {
    try {
      if (!refreshToken) {
        throw new Error('Refresh token is required');
      }

      // Verify refresh token
      const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
      
      // Find user with refresh token
      const loginUser = await Login.findOne({ 
        userId: decoded.userId,
        refreshToken: refreshToken 
      });

      if (!loginUser) {
        throw new Error('Invalid refresh token');
      }

      // Find user details
      const user = await User.findById(loginUser.userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Generate new access token
      const accessToken = jwt.sign(
        { 
          userId: user._id,
          username: loginUser.username,
          roleId: user.roleId 
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      return {
        accessToken
      };
    } catch (error) {
      throw error;
    }
  },

  // Logout user
  logout: async (userId) => {
    try {
      // Clear refresh token
      await Login.findOneAndUpdate(
        { userId },
        { refreshToken: null }
      );

      return true;
    } catch (error) {
      throw error;
    }
  },

  // Verify token middleware
  verifyToken: (token) => {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      return decoded;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
};

module.exports = loginService;
