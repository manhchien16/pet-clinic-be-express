const express = require("express");
const ClinicController = require("./controller");
const router = express.Router();
require("dotenv").config();

/**
 * @swagger
 * /api/v1/clinics:
 *   post:
 *     summary: Create a new clinic
 *     tags: [Clinics]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ClinicCreateRequest'
 *     responses:
 *       201:
 *         description: Clinic created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Clinic'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post("", ClinicController.create);

/**
 * @swagger
 * /api/v1/clinics/{id}:
 *   put:
 *     summary: Update a clinic by ID
 *     tags: [Clinics]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Clinic ID
 *         schema:
 *           type: string
 *           example: 64a7b5c8d1234567890abcde
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ClinicCreateRequest'
 *     responses:
 *       200:
 *         description: Clinic updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Clinic'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.put("/:id", ClinicController.updateById);

/**
 * @swagger
 * /api/v1/clinics/{id}:
 *   delete:
 *     summary: Delete a clinic by ID
 *     tags: [Clinics]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Clinic ID
 *         schema:
 *           type: string
 *           example: 64a7b5c8d1234567890abcde
 *     responses:
 *       200:
 *         description: Clinic deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.delete("/:id", ClinicController.deleteById);

/**
 * @swagger
 * /api/v1/clinics/{id}:
 *   get:
 *     summary: Get a clinic by ID
 *     tags: [Clinics]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Clinic ID
 *         schema:
 *           type: string
 *           example: 64a7b5c8d1234567890abcde
 *     responses:
 *       200:
 *         description: Clinic details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Clinic'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/:id", ClinicController.getById);

/**
 * @swagger
 * /api/v1/clinics:
 *   get:
 *     summary: Get all clinics
 *     tags: [Clinics]
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
 *         description: Number of clinics per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for clinic name or location
 *     responses:
 *       200:
 *         description: List of clinics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Clinic'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     total:
 *                       type: integer
 *                       example: 25
 *                     totalPages:
 *                       type: integer
 *                       example: 3
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("", ClinicController.getAll);

module.exports = router;
