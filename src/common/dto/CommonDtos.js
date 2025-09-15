/**
 * Common DTOs và structures để tái sử dụng
 * Chứa các pattern phổ biến cho pagination, response, validation
 */

/**
 * Pagination DTO cho các request có phân trang
 */
class PaginationDto {
  constructor(page = 1, limit = 10) {
    this.page = Math.max(1, parseInt(page) || 1);
    this.limit = Math.min(100, Math.max(1, parseInt(limit) || 10));
  }

  /**
   * Calculate skip value for database query
   */
  getSkip() {
    return (this.page - 1) * this.limit;
  }

  /**
   * Get pagination metadata
   */
  getMeta(total) {
    const totalPages = Math.ceil(total / this.limit);
    return {
      total,
      page: this.page,
      limit: this.limit,
      totalPages,
      hasNext: this.page < totalPages,
      hasPrev: this.page > 1
    };
  }
}

/**
 * Search DTO cho các request có tìm kiếm
 */
class SearchDto extends PaginationDto {
  constructor(page = 1, limit = 10, keyword = '', sortBy = 'createdAt', sortOrder = 'desc') {
    super(page, limit);
    this.keyword = (keyword || '').trim();
    this.sortBy = sortBy || 'createdAt';
    this.sortOrder = ['asc', 'desc'].includes(sortOrder?.toLowerCase()) ? sortOrder.toLowerCase() : 'desc';
  }

  /**
   * Get sort object for MongoDB
   */
  getSort() {
    return {
      [this.sortBy]: this.sortOrder === 'asc' ? 1 : -1
    };
  }

  /**
   * Check if search is active
   */
  hasKeyword() {
    return this.keyword.length >= 2;
  }
}

/**
 * Base Response DTO cho standardized API responses
 */
class BaseResponseDto {
  constructor(status = 'success', message = '', data = null, errorCode = null) {
    this.status = status;
    this.message = message;
    this.data = data;
    this.timestamp = new Date().toISOString();
    
    if (errorCode) {
      this.errorCode = errorCode;
    }
  }

  /**
   * Create success response
   */
  static success(data = null, message = 'Thành công') {
    return new BaseResponseDto('success', message, data);
  }

  /**
   * Create error response
   */
  static error(message = 'Có lỗi xảy ra', errorCode = 'INTERNAL_ERROR', data = null) {
    return new BaseResponseDto('error', message, data, errorCode);
  }
}

/**
 * Paginated Response DTO cho responses có phân trang
 */
class PaginatedResponseDto extends BaseResponseDto {
  constructor(results = [], pagination = {}, message = 'Thành công') {
    super('success', message, {
      results,
      pagination
    });
  }

  /**
   * Create paginated response từ repository result
   */
  static fromRepository(repositoryResult, message = 'Lấy dữ liệu thành công') {
    return new PaginatedResponseDto(
      repositoryResult.results,
      repositoryResult.pagination,
      message
    );
  }
}

/**
 * User DTO cho user data responses (exclude sensitive fields)
 */
class UserDto {
  constructor(user) {
    this.id = user._id || user.id;
    this.fullName = user.fullName;
    this.email = user.email;
    this.phoneNumber = user.phoneNumber;
    this.address = user.address;
    this.gender = user.gender;
    this.role = user.role;
    this.clinicId = user.clinicId;
    this.isVerified = user.isVerified;
    this.isActive = user.isActive;
    this.lastLoginAt = user.lastLoginAt;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }

  /**
   * Create UserDto từ database user object
   */
  static fromUser(user) {
    if (!user) return null;
    return new UserDto(user);
  }

  /**
   * Create array of UserDtos
   */
  static fromUsers(users) {
    return users.map(user => new UserDto(user));
  }
}

/**
 * Auth Response DTO cho authentication responses
 */
class AuthResponseDto extends BaseResponseDto {
  constructor(user, tokens, message = 'Đăng nhập thành công') {
    super('success', message, {
      user: UserDto.fromUser(user),
      tokens
    });
  }
}

/**
 * Registration DTO cho user registration request
 */
class UserRegistrationDto {
  constructor(body) {
    this.fullName = body.fullName?.trim();
    this.email = body.email?.toLowerCase()?.trim();
    this.password = body.password;
    this.phoneNumber = body.phoneNumber?.trim();
    this.address = body.address?.trim();
    this.gender = body.gender?.toLowerCase();
    this.role = body.role?.toLowerCase() || 'user';
    this.clinicId = body.clinicId;
  }

  /**
   * Validate required fields
   */
  validateRequired() {
    const errors = [];
    
    if (!this.fullName) errors.push('Full name là bắt buộc');
    if (!this.email) errors.push('Email là bắt buộc');
    if (!this.password) errors.push('Password là bắt buộc');
    if (!this.phoneNumber) errors.push('Phone number là bắt buộc');
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

/**
 * Login DTO cho user login request
 */
class LoginDto {
  constructor(body) {
    this.email = body.email?.toLowerCase()?.trim();
    this.password = body.password;
    this.rememberMe = Boolean(body.rememberMe);
    this.deviceInfo = {
      userAgent: body.userAgent,
      ip: body.ip
    };
  }

  /**
   * Validate required fields
   */
  validateRequired() {
    const errors = [];
    
    if (!this.email) errors.push('Email là bắt buộc');
    if (!this.password) errors.push('Password là bắt buộc');
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

/**
 * Update Profile DTO cho profile update request
 */
class UpdateProfileDto {
  constructor(body) {
    // Only include fields that are allowed to be updated
    if (body.fullName !== undefined) this.fullName = body.fullName?.trim();
    if (body.phoneNumber !== undefined) this.phoneNumber = body.phoneNumber?.trim();
    if (body.address !== undefined) this.address = body.address?.trim();
    if (body.gender !== undefined) this.gender = body.gender?.toLowerCase();
  }

  /**
   * Get only the fields that have values
   */
  getUpdateFields() {
    const updateFields = {};
    
    Object.keys(this).forEach(key => {
      if (this[key] !== undefined) {
        updateFields[key] = this[key];
      }
    });
    
    return updateFields;
  }
}

/**
 * Password Change DTO
 */
class PasswordChangeDto {
  constructor(body) {
    this.currentPassword = body.currentPassword;
    this.newPassword = body.newPassword;
    this.confirmPassword = body.confirmPassword;
  }

  /**
   * Validate password change data
   */
  validate() {
    const errors = [];
    
    if (!this.currentPassword) errors.push('Current password là bắt buộc');
    if (!this.newPassword) errors.push('New password là bắt buộc');
    if (!this.confirmPassword) errors.push('Confirm password là bắt buộc');
    
    if (this.newPassword && this.confirmPassword && this.newPassword !== this.confirmPassword) {
      errors.push('New password và confirm password không khớp');
    }
    
    if (this.currentPassword === this.newPassword) {
      errors.push('New password phải khác current password');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

/**
 * Filter DTO for complex filtering
 */
class FilterDto {
  constructor(query) {
    this.role = query.role;
    this.gender = query.gender;
    this.isActive = query.isActive !== undefined ? Boolean(query.isActive) : undefined;
    this.isVerified = query.isVerified !== undefined ? Boolean(query.isVerified) : undefined;
    this.clinicId = query.clinicId;
    this.dateFrom = query.dateFrom;
    this.dateTo = query.dateTo;
  }

  /**
   * Build MongoDB filter object
   */
  buildFilter() {
    const filter = {};
    
    if (this.role) filter.role = this.role;
    if (this.gender) filter.gender = this.gender;
    if (this.isActive !== undefined) filter.isActive = this.isActive;
    if (this.isVerified !== undefined) filter.isVerified = this.isVerified;
    if (this.clinicId) filter.clinicId = this.clinicId;
    
    // Date range filter
    if (this.dateFrom || this.dateTo) {
      filter.createdAt = {};
      if (this.dateFrom) filter.createdAt.$gte = new Date(this.dateFrom);
      if (this.dateTo) filter.createdAt.$lte = new Date(this.dateTo);
    }
    
    return filter;
  }
}

/**
 * Error Response DTO cho standardized error responses
 */
class ErrorResponseDto extends BaseResponseDto {
  constructor(message, errorCode = 'INTERNAL_ERROR', statusCode = 500, details = null) {
    super('error', message, details, errorCode);
    this.statusCode = statusCode;
  }

  /**
   * Common error responses
   */
  static notFound(resource = 'Resource') {
    return new ErrorResponseDto(`${resource} không tồn tại`, 'NOT_FOUND', 404);
  }

  static unauthorized(message = 'Không có quyền truy cập') {
    return new ErrorResponseDto(message, 'UNAUTHORIZED', 401);
  }

  static forbidden(message = 'Không đủ quyền hạn') {
    return new ErrorResponseDto(message, 'FORBIDDEN', 403);
  }

  static badRequest(message = 'Dữ liệu không hợp lệ') {
    return new ErrorResponseDto(message, 'BAD_REQUEST', 400);
  }

  static conflict(message = 'Dữ liệu bị xung đột') {
    return new ErrorResponseDto(message, 'CONFLICT', 409);
  }

  static validationError(errors) {
    return new ErrorResponseDto('Dữ liệu không hợp lệ', 'VALIDATION_ERROR', 400, { errors });
  }
}

module.exports = {
  PaginationDto,
  SearchDto,
  BaseResponseDto,
  PaginatedResponseDto,
  UserDto,
  AuthResponseDto,
  UserRegistrationDto,
  LoginDto,
  UpdateProfileDto,
  PasswordChangeDto,
  FilterDto,
  ErrorResponseDto
};