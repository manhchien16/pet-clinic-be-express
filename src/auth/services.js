const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const User = require('../users/model/user');
const { UserToken, TokenType } = require('../users/model/userToken');

const authService = {
  // Generate JWT token with unique ID
  generateToken: (payload, expiresIn = process.env.JWT_EXPIRES_IN || '7d') => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
  },

  // Verify JWT token
  verifyToken: (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
  },

  // Calculate expiry date from string
  calculateExpiryDate: (expiresIn) => {
    const expiresAt = new Date();
    if (expiresIn.endsWith('h')) {
      expiresAt.setHours(expiresAt.getHours() + parseInt(expiresIn));
    } else if (expiresIn.endsWith('m')) {
      expiresAt.setMinutes(expiresAt.getMinutes() + parseInt(expiresIn));
    } else if (expiresIn.endsWith('d')) {
      expiresAt.setDate(expiresAt.getDate() + parseInt(expiresIn));
    } else {
      expiresAt.setHours(expiresAt.getHours() + 1); // Default 1 hour
    }
    return expiresAt;
  },

  // Generate access and refresh tokens
  generateAuthTokens: async (user, deviceInfo = {}) => {
    const accessTokenJwtId = uuidv4();
    const refreshTokenJwtId = uuidv4();
    const accessTokenPayload = {
      id: user._id,
      email: user.email,
      role: user.role,
      jti: accessTokenJwtId,
      type: TokenType.ACCESS,
    };
    const refreshTokenPayload = {
      id: user._id,
      jti: refreshTokenJwtId,
      type: TokenType.REFRESH,
    };
    const accessExpiresIn = process.env.JWT_EXPIRATION_TIME || '1h';
    const refreshExpiresIn = process.env.JWT_REFRESH_EXPIRATION_TIME || '7d';
    const accessExpiresAt = authService.calculateExpiryDate(accessExpiresIn);
    const refreshExpiresAt = authService.calculateExpiryDate(refreshExpiresIn);
    await Promise.all([
      new UserToken({
        userId: user._id,
        jwtId: accessTokenJwtId,
        tokenType: TokenType.ACCESS,
        expiresAt: accessExpiresAt,
        isActive: true,
        deviceInfo
      }).save(),
      new UserToken({
        userId: user._id,
        jwtId: refreshTokenJwtId,
        tokenType: TokenType.REFRESH,
        expiresAt: refreshExpiresAt,
        isActive: true,
        deviceInfo
      }).save()
    ]);
    const accessToken = authService.generateToken(accessTokenPayload, accessExpiresIn);
    const refreshToken = authService.generateToken(refreshTokenPayload, refreshExpiresIn);
    return {
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        isVerified: user.isVerified
      }
    };
  },

  // Register new user
  register: async (userData) => {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) throw new Error('Email already registered');
    const user = new User(userData);
    const verificationToken = user.createEmailVerificationToken();
    await user.save();
    return {
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        isVerified: user.isVerified
      },
      verificationToken
    };
  },

  // Login user
  login: async (email, password, deviceInfo = {}) => {
    const user = await User.findOne({ email }).select('+password');
    if (user && user.isLocked) throw new Error('Account temporarily locked due to too many failed login attempts');
    if (!user || !(await user.comparePassword(password))) {
      if (user) await user.incLoginAttempts();
      throw new Error('Invalid email or password');
    }
    if (!user.isActive) throw new Error('Account has been deactivated. Please contact support.');
    if (user.loginAttempts > 0) await user.resetLoginAttempts();
    user.lastLoginAt = new Date();
    await user.save({ validateBeforeSave: false });
    return await authService.generateAuthTokens(user, deviceInfo);
  },

  // Logout user (deactivate specific token)
  logout: async (jwtId) => {
    const result = await UserToken.updateOne(
      { jwtId, isActive: true },
      { $set: { isActive: false } }
    );
    return result.modifiedCount > 0;
  },

  // Forgot password
  forgotPassword: async (email) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error('No user found with that email address');
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
    return resetToken;
  },

  // Reset password
  resetPassword: async (token, newPassword) => {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });
    if (!user) throw new Error('Token is invalid or has expired');
    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    await UserToken.deactivateAllUserTokens(user._id);
    return user;
  },

  // Verify email
  verifyEmail: async (token) => {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: Date.now() }
    });
    if (!user) throw new Error('Token is invalid or has expired');
    user.isVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return user;
  },

  // Refresh token
  refreshToken: async (refreshToken) => {
    const decoded = authService.verifyToken(refreshToken);
    const tokenDoc = await UserToken.findActiveByJwtId(decoded.jti, TokenType.REFRESH);
    if (!tokenDoc) throw new Error('Invalid refresh token');
    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) throw new Error('User not found or inactive');
    await UserToken.updateOne(
      { jwtId: decoded.jti },
      { $set: { isActive: false } }
    );
    return await authService.generateAuthTokens(user, tokenDoc.deviceInfo);
  },

  // Validate user from token
  validateUserFromToken: async (token) => {
    const decoded = authService.verifyToken(token);
    const tokenDoc = await UserToken.findActiveByJwtId(decoded.jti, TokenType.ACCESS);
    if (!tokenDoc) throw new Error('Token has been revoked');
    const user = await User.findById(decoded.id);
    if (!user) throw new Error('User no longer exists');
    if (!user.isActive) throw new Error('Account has been deactivated');
    if (user.changedPasswordAfter(decoded.iat)) throw new Error('User recently changed password! Please log in again.');
    return user;
  }
};

module.exports = authService;
