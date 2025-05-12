import { auth } from "@api/src/middlewares/security/auth.middleware.ts"
import { getAllUsers } from "@controllers/index.ts"
import { Router } from "express"

const getUsers = Router()
/**
 * @swagger
 * /api/v1/users/get-users:
 *   get:
 *     summary: Retrieves a list of users
 *     description: Fetches users based on filter criteria. Requires administrator authentication via JWT token.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Filter users by email (partial match)
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [user, administrator]
 *         description: Filter users by role
 *       - in: query
 *         name: createdFrom
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter users created from this date (ISO8601 format)
 *       - in: query
 *         name: createdTo
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter users created until this date (ISO8601 format)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of records per page
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           default: createdAt
 *         description: Field to sort by
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order (ascending or descending)
 *     responses:
 *       200:
 *         description: Users successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/GetUsersSuccessResponse'
 *                 - $ref: '#/components/schemas/GetUserSuccessResponse'
 *                 - $ref: '#/components/schemas/GetUsersEmptyResponse'
 *             examples:
 *               multipleUsers:
 *                 summary: Multiple users found
 *                 value:
 *                   success: true
 *                   code: "usersFound"
 *                   message: "Users found"
 *                   data:
 *                     users:
 *                       - _id: "68220c41957e5a0aa8e3e9f9"
 *                         email: "johndoe@gmail.com"
 *                         name: "Doe"
 *                         firstName: "John"
 *                         role: "user"
 *                         createdAt: "2025-05-12T14:57:05.520Z"
 *                         updatedAt: "2025-05-12T14:57:05.520Z"
 *                       - _id: "68220c41957e5a0aa8e3e9f8"
 *                         email: "janedoe@gmail.com"
 *                         name: "Doe"
 *                         firstName: "Jane"
 *                         role: "administrator"
 *                         createdAt: "2025-05-12T14:55:05.520Z"
 *                         updatedAt: "2025-05-12T14:55:05.520Z"
 *                     pagination:
 *                       total: 2
 *                       page: 1
 *                       limit: 10
 *                       totalPages: 1
 *               singleUser:
 *                 summary: Single user found
 *                 value:
 *                   success: true
 *                   code: "userFound"
 *                   message: "User found"
 *                   data:
 *                     users:
 *                       - _id: "68220c41957e5a0aa8e3e9f9"
 *                         email: "johndoe@gmail.com"
 *                         name: "Doe"
 *                         firstName: "John"
 *                         role: "user"
 *                         createdAt: "2025-05-12T14:57:05.520Z"
 *                         updatedAt: "2025-05-12T14:57:05.520Z"
 *                     pagination:
 *                       total: 1
 *                       page: 1
 *                       limit: 10
 *                       totalPages: 1
 *               noUsers:
 *                 summary: No users found
 *                 value:
 *                   success: true
 *                   code: "noUser"
 *                   message: "No user found"
 *                   data:
 *                     users: []
 *                     pagination: {}
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
getUsers.get("/get-users", auth, getAllUsers)

export default getUsers
