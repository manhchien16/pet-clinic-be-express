const User = require('../../users/model/user');

/**
 * ValidationService - Service chứa các validation logic phức tạp
 * Được sử dụng để validate uniqueness và business rules
 */
class ValidationService {
  /**
   * Kiểm tra email có tồn tại trong database không
   * @param {String} email - Email cần kiểm tra
   * @param {String} excludeId - ID của user cần loại trừ (cho update)
   * @returns {Promise<Boolean>} - true nếu email chưa tồn tại
   */
  static async isEmailUnique(email, excludeId = null) {
    try {
      const query = { email: email.toLowerCase() };
      
      // Nếu có excludeId thì loại trừ user đó ra khỏi query
      if (excludeId) {
        query._id = { $ne: excludeId };
      }
      
      const existingUser = await User.findOne(query);
      return !existingUser;
    } catch (error) {
      throw new Error(`Error checking email uniqueness: ${error.message}`);
    }
  }

  /**
   * Kiểm tra phone number có tồn tại trong database không
   * @param {String} phoneNumber - Phone number cần kiểm tra
   * @param {String} excludeId - ID của user cần loại trừ (cho update)
   * @returns {Promise<Boolean>} - true nếu phone chưa tồn tại
   */
  static async isPhoneUnique(phoneNumber, excludeId = null) {
    try {
      const query = { phoneNumber };
      
      // Nếu có excludeId thì loại trừ user đó ra khỏi query
      if (excludeId) {
        query._id = { $ne: excludeId };
      }
      
      const existingUser = await User.findOne(query);
      return !existingUser;
    } catch (error) {
      throw new Error(`Error checking phone uniqueness: ${error.message}`);
    }
  }

  /**
   * Validate email format
   * @param {String} email - Email cần validate
   * @returns {Boolean} - true nếu email hợp lệ
   */
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate phone number format (Vietnam)
   * @param {String} phoneNumber - Phone number cần validate
   * @returns {Boolean} - true nếu phone hợp lệ
   */
  static isValidPhoneNumber(phoneNumber) {
    // Vietnam phone number patterns:
    // Mobile: 09x, 08x, 07x, 05x, 03x + 8 digits
    // Landline: 02x + 8-9 digits
    const phoneRegex = /^(\+84|84|0)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-9]|9[0-9])[0-9]{7}$/;
    return phoneRegex.test(phoneNumber.replace(/\s+/g, ''));
  }

  /**
   * Validate password strength
   * @param {String} password - Password cần validate
   * @returns {Object} - {isValid: boolean, errors: array}
   */
  static validatePassword(password) {
    const errors = [];
    
    if (password.length < 8) {
      errors.push('Password phải có ít nhất 8 ký tự');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password phải có ít nhất 1 ký tự viết hoa');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password phải có ít nhất 1 ký tự viết thường');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Password phải có ít nhất 1 số');
    }
    
    if (!/[@$!%*?&]/.test(password)) {
      errors.push('Password phải có ít nhất 1 ký tự đặc biệt (@$!%*?&)');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate full name
   * @param {String} fullName - Full name cần validate
   * @returns {Boolean} - true nếu full name hợp lệ
   */
  static isValidFullName(fullName) {
    if (!fullName || fullName.trim().length < 2) {
      return false;
    }
    
    // Chỉ cho phép chữ cái, dấu cách và một số ký tự tiếng Việt
    const nameRegex = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵýỷỹ\s]{2,50}$/;
    return nameRegex.test(fullName.trim());
  }

  /**
   * Validate address
   * @param {String} address - Address cần validate
   * @returns {Boolean} - true nếu address hợp lệ
   */
  static isValidAddress(address) {
    if (!address || address.trim().length < 5) {
      return false;
    }
    
    // Địa chỉ có thể chứa chữ, số, dấu cách và một số ký tự đặc biệt
    const addressRegex = /^[a-zA-Z0-9ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵýỷỹ\s,.-/\\]{5,200}$/;
    return addressRegex.test(address.trim());
  }

  /**
   * Validate gender
   * @param {String} gender - Gender cần validate
   * @returns {Boolean} - true nếu gender hợp lệ
   */
  static isValidGender(gender) {
    const validGenders = ['male', 'female', 'other'];
    return validGenders.includes(gender?.toLowerCase());
  }

  /**
   * Validate role
   * @param {String} role - Role cần validate
   * @returns {Boolean} - true nếu role hợp lệ
   */
  static isValidRole(role) {
    const validRoles = ['user', 'staff', 'admin'];
    return validRoles.includes(role?.toLowerCase());
  }

  /**
   * Validate ObjectId format
   * @param {String} id - ID cần validate
   * @returns {Boolean} - true nếu ID hợp lệ
   */
  static isValidObjectId(id) {
    return /^[0-9a-fA-F]{24}$/.test(id);
  }

  /**
   * Sanitize input string
   * @param {String} input - Input string cần sanitize
   * @returns {String} - Cleaned string
   */
  static sanitizeInput(input) {
    if (typeof input !== 'string') {
      return input;
    }
    
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/[\x00-\x1f\x7f]/g, ''); // Remove control characters
  }

  /**
   * Validate pagination parameters
   * @param {Number} page - Page number
   * @param {Number} limit - Items per page
   * @returns {Object} - {isValid: boolean, page: number, limit: number}
   */
  static validatePagination(page, limit) {
    let validPage = parseInt(page) || 1;
    let validLimit = parseInt(limit) || 10;
    
    if (validPage < 1) validPage = 1;
    if (validLimit < 1) validLimit = 10;
    if (validLimit > 100) validLimit = 100; // Max 100 items per page
    
    return {
      isValid: true,
      page: validPage,
      limit: validLimit
    };
  }

  /**
   * Validate date format and range
   * @param {String} dateString - Date string cần validate
   * @param {String} format - Expected format (default: YYYY-MM-DD)
   * @returns {Object} - {isValid: boolean, date: Date, error: string}
   */
  static validateDate(dateString, format = 'YYYY-MM-DD') {
    try {
      const date = new Date(dateString);
      
      if (isNaN(date.getTime())) {
        return {
          isValid: false,
          date: null,
          error: 'Invalid date format'
        };
      }
      
      // Check if date is not in the future (for birthdate, etc.)
      const now = new Date();
      if (date > now) {
        return {
          isValid: false,
          date: null,
          error: 'Date cannot be in the future'
        };
      }
      
      return {
        isValid: true,
        date,
        error: null
      };
    } catch (error) {
      return {
        isValid: false,
        date: null,
        error: error.message
      };
    }
  }

  /**
   * Comprehensive validation cho user registration
   * @param {Object} userData - User data cần validate
   * @returns {Object} - {isValid: boolean, errors: array}
   */
  static async validateUserRegistration(userData) {
    const errors = [];
    
    // Validate required fields
    if (!userData.fullName) {
      errors.push('Full name là bắt buộc');
    } else if (!this.isValidFullName(userData.fullName)) {
      errors.push('Full name không hợp lệ');
    }
    
    if (!userData.email) {
      errors.push('Email là bắt buộc');
    } else if (!this.isValidEmail(userData.email)) {
      errors.push('Email không hợp lệ');
    } else {
      // Check email uniqueness
      const isEmailUnique = await this.isEmailUnique(userData.email);
      if (!isEmailUnique) {
        errors.push('Email đã được sử dụng');
      }
    }
    
    if (!userData.phoneNumber) {
      errors.push('Phone number là bắt buộc');
    } else if (!this.isValidPhoneNumber(userData.phoneNumber)) {
      errors.push('Phone number không hợp lệ');
    } else {
      // Check phone uniqueness
      const isPhoneUnique = await this.isPhoneUnique(userData.phoneNumber);
      if (!isPhoneUnique) {
        errors.push('Phone number đã được sử dụng');
      }
    }
    
    if (!userData.password) {
      errors.push('Password là bắt buộc');
    } else {
      const passwordValidation = this.validatePassword(userData.password);
      if (!passwordValidation.isValid) {
        errors.push(...passwordValidation.errors);
      }
    }
    
    if (userData.address && !this.isValidAddress(userData.address)) {
      errors.push('Address không hợp lệ');
    }
    
    if (userData.gender && !this.isValidGender(userData.gender)) {
      errors.push('Gender không hợp lệ');
    }
    
    if (userData.role && !this.isValidRole(userData.role)) {
      errors.push('Role không hợp lệ');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

module.exports = ValidationService;