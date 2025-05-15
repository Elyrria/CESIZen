import { auth } from "@middlewares/security/auth.middleware.ts"
import { deleteCategory } from "@controllers/index.ts"
import { Router } from "express"

const deleteCategoryRouter = Router()
/**
 * @swagger
 * /api/v1/category/delete/{id}:
 *   delete:
 *     summary: Delete a category
 *     description: |
 *       Deletes or deactivates a category based on its usage:
 *       - If the category is not associated with any information entries, it will be permanently deleted
 *       - If the category is in use by information entries, it will be deactivated instead (isActive=false)
 *       
 *       This endpoint is restricted to administrators only.
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectID of the category to delete
 *         example: "6825a9ff3bb6f2b08827c2e4"
 *     responses:
 *       200:
 *         description: Category successfully deleted or deactivated
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     success:
 *                       type: boolean
 *                       example: true
 *                     code:
 *                       type: string
 *                       example: categoryDeleted
 *                     message:
 *                       type: string
 *                       example: Category deleted successfully
 *                 - type: object
 *                   properties:
 *                     success:
 *                       type: boolean
 *                       example: true
 *                     code:
 *                       type: string
 *                       example: categoryUpdated
 *                     message:
 *                       type: string
 *                       example: Category updated successfully
 *                     data:
 *                       type: object
 *                       properties:
 *                         category:
 *                           $ref: '#/components/schemas/CategoryResponse'
 *             examples:
 *               categoryDeleted:
 *                 summary: Category was permanently deleted
 *                 value:
 *                   success: true
 *                   code: "categoryDeleted"
 *                   message: "Category deleted successfully"
 *               categoryDeactivated:
 *                 summary: Category was deactivated (in use by information entries)
 *                 value:
 *                   success: true
 *                   code: "categoryUpdated"
 *                   message: "Category updated successfully"
 *                   data:
 *                     category:
 *                       _id: "6825a9ff3bb6f2b08827c2e4"
 *                       name: "Comprendre le stress"
 *                       createdBy: "6821e20f005c0032d4936c24"
 *                       isActive: false
 *                       createdAt: "2025-05-15T08:46:55.589Z"
 *                       updatedAt: "2025-05-15T10:23:45.678Z"
 *                       __v: 0
 *                       updatedBy: "6821e20f005c0032d4936c24"
 *                       id: "6825a9ff3bb6f2b08827c2e4"
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
 *               invalidToken:
 *                 summary: Invalid token
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "invalidToken"
 *                     message: "Invalid token"
 *               expiredToken:
 *                 summary: Token has expired
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "expiredToken"
 *                     message: "Token expired"
 *       403:
 *         description: Insufficient permissions - admin access required
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
 *         description: Category not found
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
 *                       example: categoryNotFound
 *                     message:
 *                       type: string
 *                       example: Category not found
 *             example:
 *               success: false
 *               error:
 *                 code: "categoryNotFound"
 *                 message: "Category not found"
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
 *             examples:
 *               deleteFailed:
 *                 summary: Unable to delete category
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "unableModifyCategory"
 *                     message: "Unable to modify the category with the provided data"
 *               serverError:
 *                 summary: Unexpected server error
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "unexpectedError"
 *                     message: "An unexpected error occurred"
 */
deleteCategoryRouter.delete("/delete/:id", auth, deleteCategory)

export default deleteCategoryRouter
