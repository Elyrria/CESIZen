import { validationErrorHandler } from "@validator/validationError.validator.ts"
import { createUserValidationRules } from "@validator/user.validator.ts"
import createUser from "@controllers/index.ts"
import { Router } from "express"
const createUseRouter = Router()

/**
 * @swagger
 * /api/v1/users/create-user:
 *   post:
 *     summary: Creates a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserRequest'
 *     responses:
 *       201:
 *         description: User successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateUserSuccessResponse'
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *       409:
 *         description: User already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConflictErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiErrorResponse'
 *                 - type: object
 *                   properties:
 *                     error:
 *                       type: object
 *                       properties:
 *                         code:
 *                           example: serverError
 *                         message:
 *                           example: An internal server error occurred
 */
createUseRouter.post("/create", createUserValidationRules, validationErrorHandler, createUser)

export default createUseRouter
