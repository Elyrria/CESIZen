import { auth } from "@middlewares/security/auth.middleware.ts"
import { createCategory } from "@controllers/index.ts"
import { Router } from "express"

const createCategoryRouter = Router()
/**
 * @swagger
 * components:
 *   schemas:
 *     CategoryRequest:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the category (must be unique)
 *           example: "Techniques de respiration"
 *         isActive:
 *           type: boolean
 *           default: true
 *           description: Whether the category is active
 *           example: true
 *
 *     CategoryResponse:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: MongoDB ObjectID of the category
 *         name:
 *           type: string
 *           description: Name of the category
 *         createdBy:
 *           type: string
 *           description: MongoDB ObjectID of the administrator who created the category
 *         isActive:
 *           type: boolean
 *           description: Whether the category is active
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *         __v:
 *           type: number
 *           description: MongoDB version key
 *         id:
 *           type: string
 *           description: MongoDB ObjectID of the category
 *       example:
 *         name: "Techniques de respiration"
 *         createdBy: "6821e20f005c0032d4936c24"
 *         isActive: true
 *         _id: "6824ac779ca3a43fb48bbeac"
 *         createdAt: "2025-05-14T14:45:11.294Z"
 *         updatedAt: "2025-05-14T14:45:11.294Z"
 *         __v: 0
 *         id: "6824ac779ca3a43fb48bbeac"
 *
 * /api/v1/category/create:
 *   post:
 *     summary: Create a new category
 *     description: |
 *       Creates a new category in the system.
 *       This endpoint is restricted to administrators only.
 *       Categories can be later used to organize information entries.
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryRequest'
 *           example:
 *             name: "Techniques de respiration"
 *             isActive: true
 *     responses:
 *       200:
 *         description: Category successfully created
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
 *                   example: categoryCreated
 *                 message:
 *                   type: string
 *                   example: Category created successfully
 *                 data:
 *                   $ref: '#/components/schemas/CategoryResponse'
 *             example:
 *               success: true
 *               code: "categoryCreated"
 *               message: "Category created successfully"
 *               data:
 *                 name: "Techniques de respiration"
 *                 createdBy: "6821e20f005c0032d4936c24"
 *                 isActive: true
 *                 _id: "6824ac779ca3a43fb48bbeac"
 *                 createdAt: "2025-05-14T14:45:11.294Z"
 *                 updatedAt: "2025-05-14T14:45:11.294Z"
 *                 __v: 0
 *                 id: "6824ac779ca3a43fb48bbeac"
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
 *                       example: userNotFound
 *                     message:
 *                       type: string
 *                       example: User not found
 *             example:
 *               success: false
 *               error:
 *                 code: "userNotFound"
 *                 message: "User not found"
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
 *               createFailed:
 *                 summary: Unable to create category
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "unableCreateCategory"
 *                     message: "Unable to create the category"
 *               serverError:
 *                 summary: Unexpected server error
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "unexpectedError"
 *                     message: "An unexpected error occurred"
 */
createCategoryRouter.post("/create", auth, createCategory)

export default createCategoryRouter
