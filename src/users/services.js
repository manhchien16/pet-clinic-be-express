const User = require("./model/user");
const { generateAccessToken, generateRefreshToken } = require("../utils/jwt");

const UserService = {
  /**
   * Lấy tất cả users với pagination
   */
  async getAll(queryParams) {
    try {
      const {
        page = 1,
        limit = 10,
        search = "",
        roleId = "",
        isActive,
      } = queryParams;

      const query = {};

      // Search by name or email
      if (search) {
        query.$or = [
          { fullName: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ];
      }

      // Filter by role
      if (roleId) {
        query.roleId = roleId;
      }

      // Filter by active status
      if (isActive !== undefined) {
        query.isActive = isActive === "true";
      }

      const skip = (page - 1) * limit;
      
      const users = await User.find(query)
        .select("-password -refreshToken")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      const total = await User.countDocuments(query);

      return {
        data: users,
        pagination: {
          current: parseInt(page),
          limit: parseInt(limit),
          total: total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Lấy user theo ID
   */
  async getById(id) {
    try {
      const user = await User.findById(id).select("-password -refreshToken");
      return user;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Tạo user mới
   */
  async create(userData) {
    try {
      // Check if email already exists
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        throw new Error("Email already exists");
      }

      const user = new User(userData);
      await user.save();

      // Remove password from returned data
      const userObject = user.toObject();
      delete userObject.password;
      delete userObject.refreshToken;

      return userObject;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update user theo ID
   */
  async updateById(id, updateData) {
    try {
      // Remove sensitive fields from update data
      delete updateData.password;
      delete updateData.refreshToken;

      const user = await User.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      ).select("-password -refreshToken");

      return user;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete user theo ID (soft delete)
   */
  async deleteById(id) {
    try {
      const user = await User.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true }
      ).select("-password -refreshToken");

      return user;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Register new user
   */
  async register(userData) {
    try {
      // Check if email already exists
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        throw new Error("Email already exists");
      }

      const user = new User({
        ...userData,
        roleId: userData.roleId || "user",
      });
      
      await user.save();

      // Generate tokens
      const accessToken = generateAccessToken({ userId: user._id });
      const refreshToken = generateRefreshToken({ userId: user._id });

      // Save refresh token to database
      user.refreshToken = refreshToken;
      await user.save();

      // Remove password from returned data
      const userObject = user.toObject();
      delete userObject.password;
      delete userObject.refreshToken;

      return {
        user: userObject,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Login user
   */
  async login(email, password) {
    try {
      // Find user và include password
      const user = await User.findOne({ email, isActive: true }).select("+password");
      
      if (!user || !(await user.comparePassword(password))) {
        throw new Error("Invalid email or password");
      }

      // Update last login
      user.lastLoginAt = new Date();
      await user.save();

      // Generate tokens
      const accessToken = generateAccessToken({ userId: user._id });
      const refreshToken = generateRefreshToken({ userId: user._id });

      // Save refresh token
      user.refreshToken = refreshToken;
      await user.save();

      // Remove password from returned data
      const userObject = user.toObject();
      delete userObject.password;
      delete userObject.refreshToken;

      return {
        user: userObject,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Change password
   */
  async changePassword(userId, currentPassword, newPassword) {
    try {
      const user = await User.findById(userId).select("+password");
      
      if (!user || !(await user.comparePassword(currentPassword))) {
        throw new Error("Current password is incorrect");
      }

      user.password = newPassword;
      await user.save();

      return { message: "Password changed successfully" };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken) {
    try {
      const user = await User.findOne({ refreshToken, isActive: true }).select("+refreshToken");
      
      if (!user) {
        throw new Error("Invalid refresh token");
      }

      // Generate new access token
      const newAccessToken = generateAccessToken({ userId: user._id });

      return {
        accessToken: newAccessToken,
      };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Logout user
   */
  async logout(userId) {
    try {
      await User.findByIdAndUpdate(userId, { refreshToken: null });
      return { message: "Logged out successfully" };
    } catch (error) {
      throw error;
    }
  },
};

module.exports = UserService;