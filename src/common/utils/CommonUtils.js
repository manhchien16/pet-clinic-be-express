const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

/**
 * Common utilities để tái sử dụng trong toàn bộ application
 * Chứa các helper functions cho auth, date, string, crypto, etc.
 */

/**
 * Password utilities
 */
class PasswordUtils {
  /**
   * Hash password với bcryptjs
   * @param {String} password - Plain text password
   * @param {Number} saltRounds - Salt rounds (default: 12)
   * @returns {Promise<String>} - Hashed password
   */
  static async hashPassword(password, saltRounds = 12) {
    return await bcrypt.hash(password, saltRounds);
  }

  /**
   * Compare password với hash
   * @param {String} password - Plain text password
   * @param {String} hash - Hashed password
   * @returns {Promise<Boolean>} - True if match
   */
  static async comparePassword(password, hash) {
    return await bcrypt.compare(password, hash);
  }

  /**
   * Generate random password
   * @param {Number} length - Password length (default: 12)
   * @returns {String} - Random password
   */
  static generateRandomPassword(length = 12) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@$!%*?&';
    let password = '';
    
    // Ensure at least one character from each required category
    password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)]; // Uppercase
    password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)]; // Lowercase
    password += '0123456789'[Math.floor(Math.random() * 10)]; // Number
    password += '@$!%*?&'[Math.floor(Math.random() * 7)]; // Special char
    
    // Fill the rest
    for (let i = 4; i < length; i++) {
      password += charset[Math.floor(Math.random() * charset.length)];
    }
    
    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('');
  }
}

/**
 * Token utilities
 */
class TokenUtils {
  /**
   * Generate JWT token
   * @param {Object} payload - Token payload
   * @param {String} secret - JWT secret
   * @param {String} expiresIn - Token expiration
   * @returns {String} - JWT token
   */
  static generateJWT(payload, secret, expiresIn = '1h') {
    return jwt.sign(payload, secret, { expiresIn });
  }

  /**
   * Verify JWT token
   * @param {String} token - JWT token
   * @param {String} secret - JWT secret
   * @returns {Object} - Decoded payload
   */
  static verifyJWT(token, secret) {
    return jwt.verify(token, secret);
  }

  /**
   * Decode JWT token without verification
   * @param {String} token - JWT token
   * @returns {Object} - Decoded payload
   */
  static decodeJWT(token) {
    return jwt.decode(token);
  }

  /**
   * Generate random token
   * @param {Number} bytes - Number of bytes (default: 32)
   * @returns {String} - Random hex token
   */
  static generateRandomToken(bytes = 32) {
    return crypto.randomBytes(bytes).toString('hex');
  }

  /**
   * Generate UUID v4
   * @returns {String} - UUID string
   */
  static generateUUID() {
    return crypto.randomUUID();
  }

  /**
   * Calculate token expiry date
   * @param {String} expiresIn - Duration string (1h, 7d, 30m)
   * @returns {Date} - Expiry date
   */
  static calculateExpiryDate(expiresIn) {
    const expiresAt = new Date();
    
    if (expiresIn.endsWith('h')) {
      expiresAt.setHours(expiresAt.getHours() + parseInt(expiresIn));
    } else if (expiresIn.endsWith('m')) {
      expiresAt.setMinutes(expiresAt.getMinutes() + parseInt(expiresIn));
    } else if (expiresIn.endsWith('d')) {
      expiresAt.setDate(expiresAt.getDate() + parseInt(expiresIn));
    } else if (expiresIn.endsWith('s')) {
      expiresAt.setSeconds(expiresAt.getSeconds() + parseInt(expiresIn));
    } else {
      // Default to hours if no unit specified
      expiresAt.setHours(expiresAt.getHours() + parseInt(expiresIn) || 1);
    }
    
    return expiresAt;
  }
}

/**
 * Date utilities
 */
class DateUtils {
  /**
   * Format date to Vietnamese format
   * @param {Date} date - Date object
   * @param {String} format - Format string (default: dd/mm/yyyy)
   * @returns {String} - Formatted date
   */
  static formatDate(date, format = 'dd/mm/yyyy') {
    if (!date) return '';
    
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    
    return format
      .replace('dd', day)
      .replace('mm', month)
      .replace('yyyy', year)
      .replace('HH', hours)
      .replace('MM', minutes)
      .replace('SS', seconds);
  }

  /**
   * Get start of day
   * @param {Date} date - Date object
   * @returns {Date} - Start of day
   */
  static getStartOfDay(date = new Date()) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    return startOfDay;
  }

  /**
   * Get end of day
   * @param {Date} date - Date object
   * @returns {Date} - End of day
   */
  static getEndOfDay(date = new Date()) {
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    return endOfDay;
  }

  /**
   * Add days to date
   * @param {Date} date - Date object
   * @param {Number} days - Number of days to add
   * @returns {Date} - New date
   */
  static addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  /**
   * Check if date is expired
   * @param {Date} expiryDate - Expiry date
   * @returns {Boolean} - True if expired
   */
  static isExpired(expiryDate) {
    return new Date() > new Date(expiryDate);
  }

  /**
   * Get time ago string
   * @param {Date} date - Date object
   * @returns {String} - Time ago string
   */
  static getTimeAgo(date) {
    const now = new Date();
    const diffMs = now - new Date(date);
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    
    return DateUtils.formatDate(date);
  }
}

/**
 * String utilities
 */
class StringUtils {
  /**
   * Capitalize first letter
   * @param {String} str - Input string
   * @returns {String} - Capitalized string
   */
  static capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  /**
   * Convert to title case
   * @param {String} str - Input string
   * @returns {String} - Title case string
   */
  static toTitleCase(str) {
    if (!str) return '';
    return str
      .toLowerCase()
      .split(' ')
      .map(word => StringUtils.capitalize(word))
      .join(' ');
  }

  /**
   * Remove Vietnamese accents
   * @param {String} str - Input string
   * @returns {String} - String without accents
   */
  static removeAccents(str) {
    if (!str) return '';
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D');
  }

  /**
   * Generate slug from string
   * @param {String} str - Input string
   * @returns {String} - URL-friendly slug
   */
  static generateSlug(str) {
    if (!str) return '';
    return StringUtils.removeAccents(str)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  /**
   * Truncate string
   * @param {String} str - Input string
   * @param {Number} length - Max length
   * @param {String} suffix - Suffix to add (default: ...)
   * @returns {String} - Truncated string
   */
  static truncate(str, length = 100, suffix = '...') {
    if (!str) return '';
    if (str.length <= length) return str;
    return str.substring(0, length) + suffix;
  }

  /**
   * Mask sensitive information
   * @param {String} str - Input string
   * @param {Number} visibleStart - Characters to show at start
   * @param {Number} visibleEnd - Characters to show at end
   * @param {String} mask - Mask character
   * @returns {String} - Masked string
   */
  static mask(str, visibleStart = 3, visibleEnd = 3, mask = '*') {
    if (!str || str.length <= visibleStart + visibleEnd) return str;
    
    const start = str.substring(0, visibleStart);
    const end = str.substring(str.length - visibleEnd);
    const middle = mask.repeat(str.length - visibleStart - visibleEnd);
    
    return start + middle + end;
  }
}

/**
 * Object utilities
 */
class ObjectUtils {
  /**
   * Deep clone object
   * @param {Object} obj - Object to clone
   * @returns {Object} - Cloned object
   */
  static deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  /**
   * Remove null/undefined values from object
   * @param {Object} obj - Input object
   * @returns {Object} - Cleaned object
   */
  static removeEmpty(obj) {
    const cleaned = {};
    
    Object.keys(obj).forEach(key => {
      if (obj[key] !== null && obj[key] !== undefined && obj[key] !== '') {
        cleaned[key] = obj[key];
      }
    });
    
    return cleaned;
  }

  /**
   * Pick specific fields from object
   * @param {Object} obj - Source object
   * @param {Array} fields - Fields to pick
   * @returns {Object} - Object with picked fields
   */
  static pick(obj, fields) {
    const picked = {};
    
    fields.forEach(field => {
      if (obj.hasOwnProperty(field)) {
        picked[field] = obj[field];
      }
    });
    
    return picked;
  }

  /**
   * Omit specific fields from object
   * @param {Object} obj - Source object
   * @param {Array} fields - Fields to omit
   * @returns {Object} - Object without omitted fields
   */
  static omit(obj, fields) {
    const omitted = { ...obj };
    
    fields.forEach(field => {
      delete omitted[field];
    });
    
    return omitted;
  }
}

/**
 * Array utilities
 */
class ArrayUtils {
  /**
   * Remove duplicates from array
   * @param {Array} arr - Input array
   * @param {String} key - Key for object arrays
   * @returns {Array} - Array without duplicates
   */
  static removeDuplicates(arr, key = null) {
    if (!key) {
      return [...new Set(arr)];
    }
    
    return arr.filter((item, index, self) =>
      index === self.findIndex(t => t[key] === item[key])
    );
  }

  /**
   * Chunk array into smaller arrays
   * @param {Array} arr - Input array
   * @param {Number} size - Chunk size
   * @returns {Array} - Array of chunks
   */
  static chunk(arr, size) {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  }

  /**
   * Shuffle array
   * @param {Array} arr - Input array
   * @returns {Array} - Shuffled array
   */
  static shuffle(arr) {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}

/**
 * Validation utilities
 */
class ValidationUtils {
  /**
   * Check if value is empty
   * @param {*} value - Value to check
   * @returns {Boolean} - True if empty
   */
  static isEmpty(value) {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string') return value.trim() === '';
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === 'object') return Object.keys(value).length === 0;
    return false;
  }

  /**
   * Sanitize filename
   * @param {String} filename - Input filename
   * @returns {String} - Safe filename
   */
  static sanitizeFilename(filename) {
    return filename
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '');
  }

  /**
   * Format file size
   * @param {Number} bytes - File size in bytes
   * @returns {String} - Formatted file size
   */
  static formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

module.exports = {
  PasswordUtils,
  TokenUtils,
  DateUtils,
  StringUtils,
  ObjectUtils,
  ArrayUtils,
  ValidationUtils
};