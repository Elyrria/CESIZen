import { validationErrorHandler } from "@validator/validationError.validator.ts"
import { loginUserValidationRules } from "@validator/user.validator.ts"
import { loginUser } from "@controllers/index.ts"
import { Router } from "express"

const loginUseRouter = Router()
/**
 * @swagger
 * /api/v1/users/login:
 *   post:
 *     summary: Authenticates a user and returns tokens
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginUserRequest'
 *           example:
 *             email: "johndoe@gmail.com"
 *             password: "Password1!"
 *     responses:
 *       200:
 *         description: User successfully authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginUserSuccessResponse'
 *             examples:
 *               successResponse:
 *                 summary: User authenticated with tokens
 *                 value:
 *                   success: true
 *                   code: "usersFound"
 *                   message: "Users found"
 *                   data:
 *                     user:
 *                       email: "johndoe@gmail.com"
 *                       name: "Doe"
 *                       firstName: "John"
 *                       role: "user"
 *                       birthDate: "1994-06-14T00:00:00.000Z"
 *                       active: true
 *                       createdAt: "2025-05-12T10:15:00.188Z"
 *                       updatedAt: "2025-05-12T10:15:00.188Z"
 *                       __v: 0
 *                       id: "6821ca240b30e026b31367fb"
 *                     tokens:
 *                       accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODIxY2EyNDBiMzBlMDI2YjMxMzY3ZmIiLCJyb2xlIjoidXNlciIsImlhdCI6MTc0NzA0NTg4OSwiZXhwIjoxNzQ3MDQ2Nzg5fQ.BLyVjzpQ0EX69y-J05OBEy1na0AmB9tPKtKOVFt7LWw"
 *                       refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODIxY2EyNDBiMzBlMDI2YjMxMzY3ZmIiLCJyb2xlIjoidXNlciIsImlhdCI6MTc0NzA0NTg4OSwiZXhwIjoxNzQ3NjUwNjg5fQ.HIdpLq4rKCsTYIreQjLoBEU68jrXDRLLASl2yiUf0R4"
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserValidationErrorResponse'
 *             examples:
 *               emailValidationError:
 *                 summary: Invalid email format
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
 *       401:
 *         description: Authentication failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginUserErrorResponse'
 *             examples:
 *               wrongCredentials:
 *                 summary: Invalid credentials
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "invalidCredentials"
 *                     message: "Incorrect username/password!"
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
loginUseRouter.post("/login", loginUserValidationRules, validationErrorHandler, loginUser)

export default loginUseRouter
