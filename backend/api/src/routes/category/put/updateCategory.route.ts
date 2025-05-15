import { updateCategoryValidationRules } from "@validator/category.validator.ts"
import { validationErrorHandler } from "@validator/validationError.validator.ts"
import { auth } from "@middlewares/security/auth.middleware.ts"
import { updateCategory } from "@controllers/index.ts"
import { Router } from "express"

const updateCategoryRouter = Router()
/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateCategoryRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Updated name for the category (must be unique)
 *           example: "Comprendre le stress"
 *         isActive:
 *           type: boolean
 *           description: Updated active status for the category
 *           example: false
 *
 *     UpdateCategoryResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         code:
 *           type: string
 *           example: categoryUpdated
 *         message:
 *           type: string
 *           example: Category updated successfully
 *         data:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               description: MongoDB ObjectID of the category
 *             name:
 *               type: string
 *               description: Name of the category
 *             createdBy:
 *               type: string
 *               description: MongoDB ObjectID of the administrator who created the category
 *             updatedBy:
 *               type: string
 *               description: MongoDB ObjectID of the administrator who last updated the category
 *             isActive:
 *               type: boolean
 *               description: Whether the category is active
 *             createdAt:
 *               type: string
 *               format: date-time
 *               description: Creation timestamp
 *             updatedAt:
 *               type: string
 *               format: date-time
 *               description: Last update timestamp
 *             __v:
 *               type: number
 *               description: MongoDB version key
 *             id:
 *               type: string
 *               description: MongoDB ObjectID of the category
 *       example:
 *         success: true
 *         code: "categoryUpdated"
 *         message: "Category updated successfully"
 *         data:
 *           _id: "6825a9ff3bb6f2b08827c2e4"
 *           name: "Comprendre le stress"
 *           createdBy: "6821e20f005c0032d4936c24"
 *           isActive: false
 *           createdAt: "2025-05-15T08:46:55.589Z"
 *           updatedAt: "2025-05-15T09:16:34.380Z"
 *           __v: 0
 *           updatedBy: "6821e20f005c0032d4936c24"
 *           id: "6825a9ff3bb6f2b08827c2e4"
 *
 * /api/v1/category/update/{id}:
 *   put:
 *     summary: Update a category
 *     description: |
 *       Updates an existing category with new information.
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
 *         description: MongoDB ObjectID of the category to update
 *         example: "6825a9ff3bb6f2b08827c2e4"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCategoryRequest'
 *           examples:
 *             updateName:
 *               summary: Update category name
 *               value:
 *                 name: "Comprendre le stress et l'anxiété"
 *             updateStatus:
 *               summary: Deactivate a category
 *               value:
 *                 isActive: false
 *             updateBoth:
 *               summary: Update name and status
 *               value:
 *                 name: "Comprendre le stress"
 *                 isActive: false
 *     responses:
 *       200:
 *         description: Category successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateCategoryResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserValidationErrorResponse'
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
 *       409:
 *         description: Category name already exists
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
 *                       example: duplicateCategory
 *                     message:
 *                       type: string
 *                       example: A category with this name already exists
 *             example:
 *               success: false
 *               error:
 *                 code: "duplicateCategory"
 *                 message: "A category with this name already exists"
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
 *               updateFailed:
 *                 summary: Unable to update category
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
updateCategoryRouter.put("/update/:id", updateCategoryValidationRules, validationErrorHandler, auth, updateCategory)

export default updateCategoryRouter
