import { validationErrorHandler } from "@validator/validationError.validator.ts"
import { createUserValidationRules } from "@validator/user.validator.ts"
import createUser from "@controllers/index.ts"
import { Router } from "express"
const createUseRouter = Router()

/**
 * @swagger
 * /api/v1/users/create:
 *   post:
 *     summary: Creates a new user account
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserRequest'
 *           example:
 *             email: "johndoe@gmail.com"
 *             password: "Password1!"
 *             role: "user"
 *             name: "Doe"
 *             firstName: "John"
 *             birthDate: "1994-06-14"
 *     responses:
 *       201:
 *         description: User successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateUserSuccessResponse'
 *             examples:
 *               successResponse:
 *                 summary: User created with tokens
 *                 value:
 *                   success: true
 *                   code: "userCreated"
 *                   message: "User created successfully"
 *                   data:
 *                     user:
 *                       email: "johndoe@gmail.com"
 *                       name: "Doe"
 *                       role: "user"
 *                       firstName: "John"
 *                       birthDate: "1994-06-14"
 *                       active: true
 *                       createdAt: "2025-04-25T07:23:42.991Z"
 *                       updatedAt: "2025-04-25T07:23:42.991Z"
 *                       __v: 0
 *                       id: "680b387ebb62a1b442d8a191"
 *                     tokens:
 *                       accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODBiMzg3ZWJiNjJhMWI0NDJkOGExOTEiLCJyb2xlIjoidXNlciIsImlhdCI6MTc0NTU2NTgyMywiZXhwIjoxNzQ1NTY2NzIzfQ.BP32l2ODTEmjQbj6Kj00nS6jCMmfmPB6izhxqcrVY5E"
 *                       refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODBiMzg3ZWJiNjJhMWI0NDJkOGExOTEiLCJyb2xlIjoidXNlciIsImlhdCI6MTc0NTU2NTgyMywiZXhwIjoxNzQ2MTcwNjIzfQ.koN9f1uLRzKVSz4Q7N4jzn7GfTPh4udgQhwdwBN_D-0"
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
 *                         message: "The role must be one of the following: user"
 *                         location: "body"
 *               birthDateValidationError:
 *                 summary: Invalid date format
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "missingInfo"
 *                     message: "Validation failed"
 *                     location: "body"
 *                     errors:
 *                       - field: "birthDate"
 *                         message: "The birthDate must be a valid date in ISO8601 format"
 *                         location: "body"
 *               multipleValidationErrors:
 *                 summary: Multiple validation errors
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "missingInfo"
 *                     message: "Validation failed"
 *                     location: "body"
 *                     errors:
 *                       - field: "email"
 *                         message: "The email must be a valid email address"
 *                         location: "body"
 *                       - field: "birthDate"
 *                         message: "The birthDate must be a valid date in ISO8601 format"
 *                         location: "body"
 *                       - field: "role"
 *                         message: "The role must be one of the following: user"
 *                         location: "body"
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
 *                     code: "serverError"
 *                     message: "An unexpected error occurred while processing your request"
 */
createUseRouter.post("/create", createUserValidationRules, validationErrorHandler, createUser)

export default createUseRouter
