import { removeRefreshTokenValidationRules } from "@validator/refreshToken.validator.ts"
import { validationErrorHandler } from "@validator/validationError.validator.ts"
import { logoutUser } from "@controllers/index.ts"
import { Router } from "express"

const logoutUseRouter = Router()
/**
 * @swagger
 * /api/v1/users/logout:
 *   post:
 *     summary: Logout a user
 *     description: Invalidates a user's refresh token, effectively logging them out of the system
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: JWT refresh token to invalidate
 *           example:
 *             refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODIxY2EyNDBiMzBlMDI2YjMxMzY3ZmIiLCJyb2xlIjoidXNlciIsImlhdCI6MTc0NzA0NTg4OSwiZXhwIjoxNzQ3NjUwNjg5fQ.HIdpLq4rKCsTYIreQjLoBEU68jrXDRLLASl2yiUf0R4"
 *     responses:
 *       200:
 *         description: User successfully logged out
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 code:
 *                   type: string
 *                   example: logoutSuccess
 *                 message:
 *                   type: string
 *                   example: User logged out successfully
 *             example:
 *               success: true
 *               code: "logoutSuccess"
 *               message: "User logged out successfully"
 *       400:
 *         description: Bad request - Missing or invalid refresh token
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     success:
 *                       type: boolean
 *                       example: false
 *                     error:
 *                       type: object
 *                       properties:
 *                         code:
 *                           type: string
 *                           example: validationFailed
 *                         message:
 *                           type: string
 *                           example: Validation failed
 *                         location:
 *                           type: string
 *                           example: body
 *                         errors:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               field:
 *                                 type: string
 *                               message:
 *                                 type: string
 *                               location:
 *                                 type: string
 *                 - type: object
 *                   properties:
 *                     success:
 *                       type: boolean
 *                       example: false
 *                     error:
 *                       type: object
 *                       properties:
 *                         code:
 *                           type: string
 *                           example: alreadyLoggedOut
 *                         message:
 *                           type: string
 *                           example: Refresh token already removed
 *             examples:
 *               validationError:
 *                 summary: Validation error - Missing or invalid refresh token
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "validationFailed"
 *                     message: "Validation failed"
 *                     location: "body"
 *                     errors:
 *                       - field: "refreshToken"
 *                         message: "The refreshToken cannot be empty"
 *                         location: "body"
 *                       - field: "refreshToken"
 *                         message: "The refreshToken must be a string"
 *                         location: "body"
 *               alreadyLoggedOut:
 *                 summary: Already logged out - Token already removed
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "alreadyLoggedOut"
 *                     message: "Refresh token already removed"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 */
logoutUseRouter.post("/logout", removeRefreshTokenValidationRules, validationErrorHandler, logoutUser)

export default logoutUseRouter
