import { auth } from "@middlewares/security/auth.middleware.ts"
import { deleteActivity } from "@controllers/index.ts"
import { Router } from "express"

const deleteActivityRouter = Router()
/**
 * @swagger
 * /api/v1/activities/delete/{id}:
 *   delete:
 *     summary: Delete an activity (admin only)
 *     description: |
 *       Permanently deletes an activity by its ID.
 *       This endpoint requires authentication and is restricted to administrators only.
 *       
 *       When an activity is deleted:
 *       - For TEXT activities: The activity document is completely removed.
 *       - For VIDEO activities: Both the activity document and the associated file in GridFS are removed.
 *     tags: [Activities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the activity to delete
 *     responses:
 *       200:
 *         description: Activity successfully deleted
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
 *                   example: "activityDeleted"
 *                 message:
 *                   type: string
 *                   example: "Activity deleted successfully"
 *             example:
 *               success: true
 *               code: "activityDeleted"
 *               message: "Activity deleted successfully"
 *       400:
 *         description: Invalid activity ID
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
 *                 code: "invalidId"
 *                 message: "Invalid activity ID format"
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
 *         description: User does not have admin access
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
 *                 code: "adminAccessRequired"
 *                 message: "Admin access is required for deleting an activity"
 *       404:
 *         description: Activity not found
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
 *                 code: "activityNotFound"
 *                 message: "Activity not found"
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
 *                     message:
 *                       type: string
 *             example:
 *               success: false
 *               error:
 *                 code: "serverError"
 *                 message: "An unexpected error occurred"
 */
deleteActivityRouter.delete("/delete/:id", auth, deleteActivity)

export default deleteActivityRouter
