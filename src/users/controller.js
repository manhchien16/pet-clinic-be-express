const { successResponse, errorResponse, paginatedResponse } = require("../common/swapRespose");
const { createPagination } = require("../common/paginate");
const UserService = require("./services");

const UserController = {
  /**
   * Get all users (Admin only)
   */
  async getAll(req, res) {
    try {
      const result = await UserService.getAll(req.query);
      return paginatedResponse(res, result.data, result.pagination, "Users retrieved successfully");
    } catch (error) {
      return errorResponse(res, error.message, 500, "GET_USERS_ERROR");
    }
  },

  /**
   * Get user by ID (Admin only)
   */
  async getById(req, res) {
    try {
      const user = await UserService.getById(req.params.id);
      if (!user) {
        return errorResponse(res, "User not found", 404, "USER_NOT_FOUND");
      }
      return successResponse(res, user, "User retrieved successfully");
    } catch (error) {
      return errorResponse(res, error.message, 500, "GET_USER_ERROR");
    }
  },

  /**
   * Create new user (Admin only)
   */
  async create(req, res) {
    try {
      const user = await UserService.create(req.body);
      return successResponse(res, user, "User created successfully", 201);
    } catch (error) {
      if (error.message === "Email already exists") {
        return errorResponse(res, error.message, 400, "EMAIL_EXISTS");
      }
      return errorResponse(res, error.message, 500, "CREATE_USER_ERROR");
    }
  },

  /**
   * Update user by ID (Admin only)
   */
  async updateById(req, res) {
    try {
      const user = await UserService.updateById(req.params.id, req.body);
      if (!user) {
        return errorResponse(res, "User not found", 404, "USER_NOT_FOUND");
      }
      return successResponse(res, user, "User updated successfully");
    } catch (error) {
      return errorResponse(res, error.message, 500, "UPDATE_USER_ERROR");
    }
  },

  /**
   * Delete user by ID - soft delete (Admin only)
   */
  async deleteById(req, res) {
    try {
      const user = await UserService.deleteById(req.params.id);
      if (!user) {
        return errorResponse(res, "User not found", 404, "USER_NOT_FOUND");
      }
      return successResponse(res, user, "User deleted successfully");
    } catch (error) {
      return errorResponse(res, error.message, 500, "DELETE_USER_ERROR");
    }
  },
};

module.exports = UserController;