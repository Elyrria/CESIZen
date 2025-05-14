import { auth } from "@middlewares/security/auth.middleware.ts"
import { deleteInformation } from "@controllers/index.ts"
import { Router } from "express"

const deletInformation = Router()
/**
 * @swagger
 * /api/v1/informations/delete/{id}:
 *   delete:
 *     summary: Delete an information entry
 *     description: |
 *       Deletes an information entry and its associated file (if any).
 *       Access control rules:
 *       - Regular users can only delete their own information entries
 *       - Administrators can delete any information entry
 *       
 *       If the information has an associated media file in GridFS, it will also be deleted.
 *     tags: [Informations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectID of the information entry to delete
 *         example: "68236226831d7acd21d5e898"
 *     responses:
 *       200:
 *         description: Information successfully deleted
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
 *                   example: informationDeleted
 *                 message:
 *                   type: string
 *                   example: Information deleted successfully
 *             example:
 *               success: true
 *               code: "informationDeleted"
 *               message: "Information deleted successfully"
 *       400:
 *         description: Invalid MongoDB ObjectID format
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
 *             example:
 *               success: false
 *               error:
 *                 code: "unexpectedError"
 *                 message: "Cast to ObjectId failed for value \"68236226831d7acd21d5e8\" (type string) at path \"_id\" for model \"Information\""
 *       401:
 *         description: Authentication required or invalid token
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
 *             examples:
 *               unauthorized:
 *                 summary: No authentication token provided
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "unauthorized"
 *                     message: "Unauthorized access"
 *               invalidSignature:
 *                 summary: Invalid token signature
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "signatureInvalid"
 *                     message: "Invalid token signature"
 *               expiredToken:
 *                 summary: Token has expired
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "expiredToken"
 *                     message: "Token expired"
 *       403:
 *         description: Insufficient permissions
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
 *                       example: insufficientAccess
 *                     message:
 *                       type: string
 *                       example: Insufficient access
 *             example:
 *               success: false
 *               error:
 *                 code: "insufficientAccess"
 *                 message: "Insufficient access"
 *       404:
 *         description: Information or user not found
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
 *             examples:
 *               informationNotFound:
 *                 summary: Information entry not found
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "informationNotFound"
 *                     message: "Information not found"
 *               userNotFound:
 *                 summary: User not found
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "userNotFound"
 *                     message: "User not found"
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
deletInformation.delete("/delete/:id", auth, deleteInformation)

export default deletInformation
