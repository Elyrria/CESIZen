import { auth } from "@api/src/middlewares/security/auth.middleware.ts"
import { deleteUserById } from "@controllers/index.ts"
import { Router } from "express"

const getUsers = Router()
/**
 * @swagger
 * /api/v1/users/delete/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     description: Deletes a user from the system based on the provided ID. Requires authentication and proper authorization based on user roles.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectID of the user to delete
 *         example: "6821ca240b30e026b31367fb"
 *     responses:
 *       200:
 *         description: User successfully deleted
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
 *                   example: userDeleted
 *                 message:
 *                   type: string
 *                   example: User deleted successfully
 *             example:
 *               success: true
 *               code: "userDeleted"
 *               message: "User deleted successfully"
 *       403:
 *         description: Forbidden - Invalid token or insufficient privileges
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
 *                           example: signatureInvalid
 *                         message:
 *                           type: string
 *                           example: Invalid token signature
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
 *                           example: insufficientAccess
 *                         message:
 *                           type: string
 *                           example: Insufficient access
 *             examples:
 *               invalidToken:
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
 *                     message: "Insufficient access"
 *       400:
 *         description: User not found or already deleted
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
 *                       example: noConditions
 *                     message:
 *                       type: string
 *                       example: No conditions met for this request
 *             example:
 *               success: false
 *               error:
 *                 code: "noConditions"
 *                 message: "No conditions met for this request"
 *       500:
 *         description: Server error
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
 *                       example: unexpectedError
 *                     message:
 *                       type: string
 *                       example: An unexpected error occurred
 *             example:
 *               success: false
 *               error:
 *                 code: "unexpectedError"
 *                 message: "An unexpected error occurred"
 */
getUsers.delete("/delete/:id", auth, deleteUserById)

export default getUsers
