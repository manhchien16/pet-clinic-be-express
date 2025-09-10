const { body, validationResult } = require("express-validator");
const { errorResponse } = require("../common/swapRespose");

/**
 * Middleware để handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    return errorResponse(res, errorMessages.join(", "), 400, "VALIDATION_ERROR");
  }
  next();
};

/**
 * Validation rules for user registration
 */
const registerValidation = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("fullName")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Full name is required"),
  body("phoneNumber")
    .optional()
    .isMobilePhone()
    .withMessage("Please provide a valid phone number"),
  body("roleId")
    .optional()
    .isIn(["user", "staff", "admin"])
    .withMessage("Invalid role"),
];

/**
 * Validation rules for user login
 */
const loginValidation = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("password")
    .notEmpty()
    .withMessage("Password is required"),
];

/**
 * Validation rules for updating user profile
 */
const updateUserValidation = [
  body("email")
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("fullName")
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage("Full name cannot be empty"),
  body("phoneNumber")
    .optional()
    .isMobilePhone()
    .withMessage("Please provide a valid phone number"),
  body("gender")
    .optional()
    .isIn(["male", "female", "other"])
    .withMessage("Invalid gender"),
  body("roleId")
    .optional()
    .isIn(["user", "staff", "admin"])
    .withMessage("Invalid role"),
];

/**
 * Validation rules for changing password
 */
const changePasswordValidation = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),
  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters long"),
  body("confirmPassword")
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error("Password confirmation does not match");
      }
      return true;
    }),
];

module.exports = {
  handleValidationErrors,
  registerValidation,
  loginValidation,
  updateUserValidation,
  changePasswordValidation,
};
