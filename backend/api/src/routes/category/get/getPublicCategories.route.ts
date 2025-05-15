import { getPublicCategories } from "@controllers/index.ts"
import { Router } from "express"

const getPublicCategoriesRouter = Router()
/**
 * @swagger
 * /api/v1/category/get-public-categories:
 *   get:
 *     summary: Retrieve all active categories (public access)
 *     description: |
 *       Retrieves all active categories in the system.
 *       This endpoint is publicly accessible and does not require authentication.
 *       Only categories with isActive=true are returned.
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Active categories successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/AdminCategoryListResponse'
 *                 - $ref: '#/components/schemas/EmptyCategoryResponse'
 *             examples:
 *               categoryList:
 *                 summary: List of active categories
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
 *                 summary: No active categories found
 *                 value:
 *                   success: true
 *                   code: "noCategory"
 *                   message: "No categories found"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 */
getPublicCategoriesRouter.get("/get-public-categories", getPublicCategories)

export default getPublicCategoriesRouter
