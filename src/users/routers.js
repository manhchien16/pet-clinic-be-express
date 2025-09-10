const express = require("express");
const router = express.Router();
const UserController = require("./controller");
const { authenticateToken, authorizeRoles } = require("../middleware/auth");
const { body } = require("express-validator");
const { handleValidationErrors } = require("../middleware/validation");

// Validation rules
const createUserValidation = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("phone")
    .optional()
    .isMobilePhone()
    .withMessage("Please provide a valid phone number"),
  body("role")
    .optional()
    .isIn(["admin", "staff", "customer"])
    .withMessage("Role must be admin, staff, or customer"),
];

const updateUserValidation = [
  body("name")
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),
  body("email")
    .optional()
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
  body("phone")
    .optional()
    .isMobilePhone()
    .withMessage("Please provide a valid phone number"),
  body("role")
    .optional()
    .isIn(["admin", "staff", "customer"])
    .withMessage("Role must be admin, staff, or customer"),
];

// All user routes require authentication and admin role
router.use(authenticateToken);
router.use(authorizeRoles("admin"));

/**
 * @swagger
 * tags:
 *   name: Users Management
 *   description: User management operations (Admin only)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateUserRequest:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           example: Jane Smith
 *         email:
 *           type: string
 *           format: email
 *           example: jane@example.com
 *         password:
 *           type: string
 *           minLength: 6
 *           example: password123
 *         phone:
 *           type: string
 *           example: +84-90-123-4567
 *         role:
 *           type: string
 *           enum: [admin, staff, customer]
 *           example: staff
 *     UpdateUserRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: Jane Smith Updated
 *         email:
 *           type: string
 *           format: email
 *           example: jane.updated@example.com
 *         phone:
 *           type: string
 *           example: +84-90-987-6543
 *         role:
 *           type: string
 *           enum: [admin, staff, customer]
 *           example: admin
 *     Pagination:
 *       type: object
 *       properties:
 *         currentPage:
 *           type: integer
 *           example: 1
 *         totalPages:
 *           type: integer
 *           example: 5
 *         totalItems:
 *           type: integer
 *           example: 47
 *         itemsPerPage:
 *           type: integer
 *           example: 10
 *         hasNextPage:
 *           type: boolean
 *           example: true
 *         hasPrevPage:
 *           type: boolean
 *           example: false
 */

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Get all users with pagination and filtering
 *     tags: [Users Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name or email
 *         example: john
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [admin, staff, customer]
 *         description: Filter by user role
 *         example: staff
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *         example: true
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *                 message:
 *                   type: string
 *                   example: Users retrieved successfully
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.get("/", UserController.getAll);

/**
 * @swagger
 * /api/v1/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID (MongoDB ObjectId)
 *         example: 64a7b5c8d1234567890abcdf
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *                 message:
 *                   type: string
 *                   example: User retrieved successfully
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.get("/:id", UserController.getById);

/**
 * @swagger
 * /api/v1/users:
 *   post:
 *     summary: Create new user (Admin only)
 *     tags: [Users Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserRequest'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *                 message:
 *                   type: string
 *                   example: User created successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.post("/", createUserValidation, handleValidationErrors, UserController.create);

/**
 * @swagger
 * /api/v1/users/{id}:
 *   put:
 *     summary: Update user by ID (Admin only)
 *     tags: [Users Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID (MongoDB ObjectId)
 *         example: 64a7b5c8d1234567890abcdf
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserRequest'
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *                 message:
 *                   type: string
 *                   example: User updated successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.put("/:id", updateUserValidation, handleValidationErrors, UserController.updateById);

/**
 * @swagger
 * /api/v1/users/{id}:
 *   delete:
 *     summary: Delete user by ID - Soft delete (Admin only)
 *     tags: [Users Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID (MongoDB ObjectId)
 *         example: 64a7b5c8d1234567890abcdf
 *     responses:
 *       200:
 *         description: User deleted successfully (soft delete - user marked as inactive)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *                 message:
 *                   type: string
 *                   example: User deleted successfully
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.delete("/:id", UserController.deleteById);

module.exports = router;
