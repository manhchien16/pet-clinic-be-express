const express = require("express");
const PetController = require("./controller");
const router = express.Router();
require("dotenv").config();

/**
 * @swagger
 * /api/v1/pets:
 *   post:
 *     summary: Create a new pet
 *     tags: [Pets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PetCreateRequest'
 *     responses:
 *       201:
 *         description: Pet created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pet'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post("", PetController.createPet);

/**
 * @swagger
 * /api/v1/pets/{id}:
 *   put:
 *     summary: Update a pet by ID
 *     tags: [Pets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Pet ID
 *         schema:
 *           type: string
 *           example: 64a7b5c8d1234567890abcde
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PetCreateRequest'
 *     responses:
 *       200:
 *         description: Pet updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pet'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.put("/:id", PetController.updatePet);

/**
 * @swagger
 * /api/v1/pets/{id}:
 *   delete:
 *     summary: Delete a pet by ID
 *     tags: [Pets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Pet ID
 *         schema:
 *           type: string
 *           example: 64a7b5c8d1234567890abcde
 *     responses:
 *       200:
 *         description: Pet deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.delete("/:id", PetController.deletePet);

/**
 * @swagger
 * /api/v1/pets/{id}:
 *   get:
 *     summary: Get a pet by ID
 *     tags: [Pets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Pet ID
 *         schema:
 *           type: string
 *           example: 64a7b5c8d1234567890abcde
 *     responses:
 *       200:
 *         description: Pet details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pet'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/:id", PetController.getPetById);

/**
 * @swagger
 * /api/v1/pets:
 *   get:
 *     summary: Get all pets
 *     tags: [Pets]
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
 *         description: Number of pets per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for pet name or other fields
 *     responses:
 *       200:
 *         description: List of pets retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Pet'
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
 *                       example: 50
 *                     totalPages:
 *                       type: integer
 *                       example: 5
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("", PetController.getAllPets);

module.exports = router;
