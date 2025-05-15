import { auth } from "@middlewares/security/auth.middleware.ts"
import { getAdminCategories } from "@controllers/index.ts"
import { Router } from "express"

const getAdminCategoriesRouter = Router()
/**
 * @swagger
 * components:
 *   schemas:
 *     AdminCategoryListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         code:
 *           type: string
 *           example: categoryList
 *         message:
 *           type: string
 *           example: Categories list retrieved successfully
 *         data:
 *           type: object
 *           properties:
 *             categories:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CategoryResponse'
 *
 *     EmptyCategoryResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         code:
 *           type: string
 *           example: noCategory
 *         message:
 *           type: string
 *           example: No categories found
 *
 * /api/v1/category/get-categories:
 *   get:
 *     summary: Retrieve all categories (admin access)
 *     description: |
 *       Retrieves all categories in the system, including both active and inactive ones.
 *       This endpoint is restricted to administrators only.
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Categories successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/AdminCategoryListResponse'
 *                 - $ref: '#/components/schemas/EmptyCategoryResponse'
 *             examples:
 *               categoryList:
 *                 summary: List of all categories
 *                 value:
 *                   success: true
 *                   code: "categoryList"
 *                   message: "Categories list retrieved successfully"
 *                   data:
 *                     categories:
 *                       - _id: "6825a9ff3bb6f2b08827c2e4"
 *                         name: "Comprendre le stress"
 *                         createdBy: "6821e20f005c0032d4936c24"
 *                         isActive: true
 *                         createdAt: "2025-05-15T08:46:55.589Z"
 *                         updatedAt: "2025-05-15T08:46:55.589Z"
 *                         __v: 0
 *                         id: "6825a9ff3bb6f2b08827c2e4"
 *                       - _id: "6825aa073bb6f2b08827c2e7"
 *                         name: "Gestion du stress au travail"
 *                         createdBy: "6821e20f005c0032d4936c24"
 *                         isActive: true
 *                         createdAt: "2025-05-15T08:47:03.556Z"
 *                         updatedAt: "2025-05-15T08:47:03.556Z"
 *                         __v: 0
 *                         id: "6825aa073bb6f2b08827c2e7"
 *                       - _id: "6825a9f43bb6f2b08827c2e1"
 *                         name: "Méditation guidée"
 *                         createdBy: "6821e20f005c0032d4936c24"
 *                         isActive: true
 *                         createdAt: "2025-05-15T08:46:44.436Z"
 *                         updatedAt: "2025-05-15T08:46:44.436Z"
 *                         __v: 0
 *                         id: "6825a9f43bb6f2b08827c2e1"
 *                       - _id: "6824ac779ca3a43fb48bbeac"
 *                         name: "Techniques de respiration"
 *                         createdBy: "6821e20f005c0032d4936c24"
 *                         isActive: true
 *                         createdAt: "2025-05-14T14:45:11.294Z"
 *                         updatedAt: "2025-05-14T14:45:11.294Z"
 *                         __v: 0
 *                         id: "6824ac779ca3a43fb48bbeac"
 *               emptyList:
 *                 summary: No categories found
 *                 value:
 *                   success: true
 *                   code: "noCategory"
 *                   message: "No categories found"
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
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 */
getAdminCategoriesRouter.get("/get-categories", auth, getAdminCategories)

export default getAdminCategoriesRouter
