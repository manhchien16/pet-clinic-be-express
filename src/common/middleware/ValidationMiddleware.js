const ValidationService = require('../services/ValidationService');
const { errorResponse } = require('../swapRespose');

/**
 * Middleware để validate request data
 * Sử dụng ValidationService để check các business rules
 */
class ValidationMiddleware {
  /**
   * Validate user registration data
   */
  static async validateUserRegistration(req, res, next) {
    try {
      const userData = req.body;
      
      // Sanitize input data
      if (userData.fullName) userData.fullName = ValidationService.sanitizeInput(userData.fullName);
      if (userData.email) userData.email = ValidationService.sanitizeInput(userData.email.toLowerCase());
      if (userData.phoneNumber) userData.phoneNumber = ValidationService.sanitizeInput(userData.phoneNumber);
      if (userData.address) userData.address = ValidationService.sanitizeInput(userData.address);
      
      // Comprehensive validation
      const validation = await ValidationService.validateUserRegistration(userData);
      
      if (!validation.isValid) {
        return errorResponse(res, 400, 'VALIDATION_ERROR', validation.errors.join('; '));
      }
      
      // Update sanitized data back to request
      req.body = userData;
      next();
    } catch (error) {
      return errorResponse(res, 500, 'VALIDATION_SERVICE_ERROR', 'Lỗi trong quá trình validation');
    }
  }

  /**
   * Validate user login data
   */
  static validateUserLogin(req, res, next) {
    try {
      const { email, password } = req.body;
      const errors = [];
      
      if (!email) {
        errors.push('Email là bắt buộc');
      } else if (!ValidationService.isValidEmail(email)) {
        errors.push('Email không hợp lệ');
      }
      
      if (!password) {
        errors.push('Password là bắt buộc');
      }
      
      if (errors.length > 0) {
        return errorResponse(res, 400, 'VALIDATION_ERROR', errors.join('; '));
      }
      
      // Sanitize input
      req.body.email = ValidationService.sanitizeInput(email.toLowerCase());
      req.body.password = password; // Don't sanitize password
      
      next();
    } catch (error) {
      return errorResponse(res, 500, 'VALIDATION_SERVICE_ERROR', 'Lỗi trong quá trình validation');
    }
  }

  /**
   * Validate password change data
   */
  static validatePasswordChange(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;
      const errors = [];
      
      if (!currentPassword) {
        errors.push('Current password là bắt buộc');
      }
      
      if (!newPassword) {
        errors.push('New password là bắt buộc');
      } else {
        const passwordValidation = ValidationService.validatePassword(newPassword);
        if (!passwordValidation.isValid) {
          errors.push(...passwordValidation.errors);
        }
      }
      
      if (currentPassword === newPassword) {
        errors.push('New password phải khác current password');
      }
      
      if (errors.length > 0) {
        return errorResponse(res, 400, 'VALIDATION_ERROR', errors.join('; '));
      }
      
      next();
    } catch (error) {
      return errorResponse(res, 500, 'VALIDATION_SERVICE_ERROR', 'Lỗi trong quá trình validation');
    }
  }

  /**
   * Validate profile update data
   */
  static validateProfileUpdate(req, res, next) {
    try {
      const userData = req.body;
      const errors = [];
      
      // Validate individual fields if provided
      if (userData.fullName !== undefined) {
        if (!ValidationService.isValidFullName(userData.fullName)) {
          errors.push('Full name không hợp lệ');
        } else {
          userData.fullName = ValidationService.sanitizeInput(userData.fullName);
        }
      }
      
      if (userData.phoneNumber !== undefined) {
        if (!ValidationService.isValidPhoneNumber(userData.phoneNumber)) {
          errors.push('Phone number không hợp lệ');
        } else {
          userData.phoneNumber = ValidationService.sanitizeInput(userData.phoneNumber);
        }
      }
      
      if (userData.address !== undefined) {
        if (!ValidationService.isValidAddress(userData.address)) {
          errors.push('Address không hợp lệ');
        } else {
          userData.address = ValidationService.sanitizeInput(userData.address);
        }
      }
      
      if (userData.gender !== undefined) {
        if (!ValidationService.isValidGender(userData.gender)) {
          errors.push('Gender không hợp lệ');
        }
      }
      
      if (errors.length > 0) {
        return errorResponse(res, 400, 'VALIDATION_ERROR', errors.join('; '));
      }
      
      // Update sanitized data back to request
      req.body = userData;
      next();
    } catch (error) {
      return errorResponse(res, 500, 'VALIDATION_SERVICE_ERROR', 'Lỗi trong quá trình validation');
    }
  }

  /**
   * Validate ObjectId parameters
   */
  static validateObjectId(paramName = 'id') {
    return (req, res, next) => {
      try {
        const id = req.params[paramName];
        
        if (!ValidationService.isValidObjectId(id)) {
          return errorResponse(res, 400, 'INVALID_ID', `${paramName} không hợp lệ`);
        }
        
        next();
      } catch (error) {
        return errorResponse(res, 500, 'VALIDATION_SERVICE_ERROR', 'Lỗi trong quá trình validation');
      }
    };
  }

  /**
   * Validate pagination parameters
   */
  static validatePagination(req, res, next) {
    try {
      const { page, limit } = req.query;
      
      const validation = ValidationService.validatePagination(page, limit);
      
      // Update query parameters với validated values
      req.query.page = validation.page;
      req.query.limit = validation.limit;
      
      next();
    } catch (error) {
      return errorResponse(res, 500, 'VALIDATION_SERVICE_ERROR', 'Lỗi trong quá trình validation');
    }
  }

  /**
   * Validate search parameters
   */
  static validateSearch(req, res, next) {
    try {
      const { keyword } = req.query;
      
      if (keyword) {
        // Sanitize search keyword
        req.query.keyword = ValidationService.sanitizeInput(keyword);
        
        // Validate keyword length
        if (req.query.keyword.length < 2) {
          return errorResponse(res, 400, 'INVALID_SEARCH', 'Keyword phải có ít nhất 2 ký tự');
        }
        
        if (req.query.keyword.length > 100) {
          return errorResponse(res, 400, 'INVALID_SEARCH', 'Keyword không được quá 100 ký tự');
        }
      }
      
      next();
    } catch (error) {
      return errorResponse(res, 500, 'VALIDATION_SERVICE_ERROR', 'Lỗi trong quá trình validation');
    }
  }

  /**
   * Validate email uniqueness (for async validation)
   */
  static async validateEmailUniqueness(req, res, next) {
    try {
      const { email } = req.body;
      const userId = req.user?.id; // For update operations
      
      if (email) {
        const isUnique = await ValidationService.isEmailUnique(email, userId);
        if (!isUnique) {
          return errorResponse(res, 400, 'EMAIL_EXISTS', 'Email đã được sử dụng');
        }
      }
      
      next();
    } catch (error) {
      return errorResponse(res, 500, 'VALIDATION_SERVICE_ERROR', 'Lỗi kiểm tra email uniqueness');
    }
  }

  /**
   * Validate phone uniqueness (for async validation)
   */
  static async validatePhoneUniqueness(req, res, next) {
    try {
      const { phoneNumber } = req.body;
      const userId = req.user?.id; // For update operations
      
      if (phoneNumber) {
        const isUnique = await ValidationService.isPhoneUnique(phoneNumber, userId);
        if (!isUnique) {
          return errorResponse(res, 400, 'PHONE_EXISTS', 'Phone number đã được sử dụng');
        }
      }
      
      next();
    } catch (error) {
      return errorResponse(res, 500, 'VALIDATION_SERVICE_ERROR', 'Lỗi kiểm tra phone uniqueness');
    }
  }

  /**
   * Generic field validation middleware factory
   */
  static validateField(fieldName, validatorFunction, errorMessage) {
    return (req, res, next) => {
      try {
        const value = req.body[fieldName];
        
        if (value !== undefined && !validatorFunction(value)) {
          return errorResponse(res, 400, 'VALIDATION_ERROR', errorMessage);
        }
        
        next();
      } catch (error) {
        return errorResponse(res, 500, 'VALIDATION_SERVICE_ERROR', 'Lỗi trong quá trình validation');
      }
    };
  }

  /**
   * Validate required fields
   */
  static validateRequiredFields(requiredFields) {
    return (req, res, next) => {
      try {
        const errors = [];
        
        requiredFields.forEach(field => {
          if (!req.body[field]) {
            errors.push(`${field} là bắt buộc`);
          }
        });
        
        if (errors.length > 0) {
          return errorResponse(res, 400, 'MISSING_REQUIRED_FIELDS', errors.join('; '));
        }
        
        next();
      } catch (error) {
        return errorResponse(res, 500, 'VALIDATION_SERVICE_ERROR', 'Lỗi trong quá trình validation');
      }
    };
  }
}

module.exports = ValidationMiddleware;