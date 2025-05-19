import { auth } from "@api/src/middlewares/security/auth.middleware.ts"
import { getUserById } from "@controllers/index.ts"
import { Router } from "express"

const getUsers = Router()
/**
 * @swagger
 * /api/v1/users/get-user/{id}:
 *   get:
 *     summary: Retrieve a user by ID
 *     description: |
 *       Fetches a specific user by their ID. 
 *       Requires administrator authentication via JWT token.
 *       The authenticated user must have sufficient permissions to access user data.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to retrieve
 *     responses:
 *       200:
 *         description: User successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GetUserByIdSuccessResponse'
 *             example:
 *               success: true
 *               code: "userFound"
 *               message: "User found"
 *               data:
 *                 user:
 *                   _id: "68220c41957e5a0aa8e3e9f9"
 *                   email: "johndoe@gmail.com"
 *                   name: "Doe"
 *                   firstName: "John"
 *                   role: "user"
 *                   createdAt: "2025-05-12T14:57:05.520Z"
 *                   updatedAt: "2025-05-12T14:57:05.520Z"
 *       400:
 *         description: Bad request - Missing user ID
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
 *                     message:
 *                       type: string
 *             example:
 *               success: false
 *               error:
 *                 code: "missingInfo"
 *                 message: "Missing required information"
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
 *         description: Forbidden - Token invalid or insufficient privileges
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/TokenExpiredErrorResponse'
 *                 - $ref: '#/components/schemas/TokenInvalidErrorResponse'
 *             examples:
 *               tokenExpired:
 *                 summary: Token has expired
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "expiredToken"
 *                     message: "Token expired"
 *               tokenInvalid:
 *                 summary: Invalid token signature
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "signatureInvalid"
 *                     message: "Invalid token signature"
 *               insufficientAccess:
 *                 summary: User lacks required permissions
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "insufficientAccess"
 *                     message: "You don't have sufficient access to perform this action"
 *       404:
 *         description: User not found
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
 *                     message:
 *                       type: string
 *             example:
 *               success: false
 *               error:
 *                 code: "userNotFound"
 *                 message: "User not found"
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
getUsers.get("/get-user/:id", auth, getUserById)

export default getUsers
