import { validationErrorHandler } from "@validator/validationError.validator.ts"
import { adminCreateUserValidationRules } from "@validator/user.validator.ts"
import { auth } from "@api/src/middlewares/security/auth.middleware.ts"
import { adminCreateUser } from "@controllers/index.ts"
import { Router } from "express"
const createUseRouter = Router()
/**
 * @swagger
 * /api/v1/users/admin-create:
 *   post:
 *     summary: Creates a new user with admin privileges
 *     description: Allows administrators to create new user accounts with various roles. Requires admin authentication via JWT token.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdminCreateUserRequest'
 *           example:
 *             email: "johndoe@gmail.com"
 *             password: "Password1!"
 *             name: "Doe"
 *             firstName: "John"
 *             birthDate: "1994-06-14"
 *             role: "administrator"
 *     responses:
 *       201:
 *         description: User successfully created by admin
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AdminCreateUserSuccessResponse'
 *             examples:
 *               successResponse:
 *                 summary: Administrator successfully created a new user
 *                 value:
 *                   success: true
 *                   code: "userCreated"
 *                   message: "User created successfully"
 *                   data:
 *                     email: "johndoe@gmail.com"
 *                     name: "Doe"
 *                     firstName: "John"
 *                     role: "administrator"
 *                     birthDate: "1994-06-14T00:00:00.000Z"
 *                     active: true
 *                     createdAt: "2025-05-12T12:14:04.066Z"
 *                     updatedAt: "2025-05-12T12:14:04.066Z"
 *                     __v: 0
 *                     id: "6821e60c2ff890a6189d367b"
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserValidationErrorResponse'
 *             examples:
 *               roleValidationError:
 *                 summary: Invalid role
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "missingInfo"
 *                     message: "Validation failed"
 *                     location: "body"
 *                     errors:
 *                       - field: "role"
 *                         message: "The role must be one of the following: user, administrator"
 *                         location: "body"
 *       401:
 *         description: Unauthorized - No token provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                       example: unauthorized
 *                     message:
 *                       type: string
 *                       example: No token provided
 *       403:
 *         description: Forbidden - Token expired or insufficient privileges
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TokenExpiredErrorResponse'
 *             examples:
 *               tokenExpired:
 *                 summary: Token has expired
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "expiredToken"
 *                     message: "Token expired"
 *               insufficientAccess:
 *                 summary: User lacks required permissions
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "insufficientAccess"
 *                     message: "You don't have sufficient access to perform this action"
 *       409:
 *         description: User already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserCreationErrorResponse'
 *             examples:
 *               userExists:
 *                 summary: User already exists
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "unableToCreateUser"
 *                     message: "Unable to create an account with the provided information"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 *             examples:
 *               serverError:
 *                 summary: Internal server error
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "unexpectedError"
 *                     message: "An unexpected error occurred"
 */
createUseRouter.post("/admin-create", auth, adminCreateUserValidationRules, validationErrorHandler, adminCreateUser)

export default createUseRouter
