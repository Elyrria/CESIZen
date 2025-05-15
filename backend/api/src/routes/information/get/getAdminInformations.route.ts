import { auth } from "@middlewares/security/auth.middleware.ts"
import { getAdminInformations } from "@controllers/index.ts"
import { Router } from "express"

const getInformationsRouter = Router()
/**
 * @swagger
 * /api/v1/informations/get-informations:
 *   get:
 *     summary: Retrieve a list of information entries with role-based access control
 *     description: |
 *       Fetches a paginated list of information entries with optional filtering and sorting.
 *       This endpoint requires authentication and implements role-based access control:
 *       
 *       - Regular users can only see:
 *         - Their own information entries (all statuses: DRAFT, PENDING, PUBLISHED)
 *         - PUBLISHED information entries from other users
 *       
 *       - Administrators can see all information entries from all users in any status
 *     tags: [Informations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [TEXT, IMAGE, VIDEO]
 *         description: Filter by information type
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [DRAFT, PENDING, PUBLISHED]
 *         description: Filter by publication status
 *       - in: query
 *         name: authorId
 *         schema:
 *           type: string
 *         description: Filter by author ID
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in title and description
 *       - in: query
 *         name: createdFrom
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter by creation date (from)
 *       - in: query
 *         name: createdTo
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter by creation date (to)
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: createdAt
 *         description: Field to sort by (createdAt, title, type, status)
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order (ascending or descending)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           minimum: 1
 *           maximum: 100
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Successfully retrieved information list
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/GetInformationsResponse'
 *                 - $ref: '#/components/schemas/NoInformationsResponse'
 *             examples:
 *               informationList:
 *                 summary: List of information entries
 *                 value:
 *                   success: true
 *                   code: "informationList"
 *                   message: "Information list retrieved successfully"
 *                   data:
 *                     items:
 *                       - fileMetadata:
 *                           filename: "stress-infographic.jpg"
 *                           contentType: "image/jpeg"
 *                           size: 73276
 *                           uploadDate: "2025-05-13T15:39:17.829Z"
 *                         _id: "682367a522de12d1d3d9b0a6"
 *                         authorId: "6821e20f005c0032d4936c24"
 *                         title: "Infographie sur la gestion du stress"
 *                         descriptionInformation: "Une infographie illustrant les principales techniques de gestion du stress"
 *                         name: "infographie-stress"
 *                         type: "IMAGE"
 *                         status: "DRAFT"
 *                         validatedAndPublishedAt: null
 *                         fileId: "682367a522de12d1d3d9b0a4"
 *                         createdAt: "2025-05-13T15:39:17.836Z"
 *                         updatedAt: "2025-05-13T15:39:17.836Z"
 *                         __v: 0
 *                         id: "682367a522de12d1d3d9b0a6"
 *                         mediaUrl: "http://localhost:3000/api/v1/media/682367a522de12d1d3d9b0a6"
 *                       - _id: "6823673f22de12d1d3d9b0a1"
 *                         authorId: "6821e20f005c0032d4936c24"
 *                         title: "Techniques de respiration anti-stress"
 *                         descriptionInformation: "Découvrez les techniques de respiration pour réduire le stress au quotidien"
 *                         name: "respiration-anti-stress"
 *                         type: "TEXT"
 *                         content: "La technique de respiration 4-7-8 est une méthode simple mais efficace pour réduire le stress immédiat. Inspirez pendant 4 secondes, retenez votre souffle pendant 7 secondes, puis expirez lentement pendant 8 secondes. Répétez ce cycle 3 à 4 fois."
 *                         status: "DRAFT"
 *                         validatedAndPublishedAt: null
 *                         createdAt: "2025-05-13T15:37:35.011Z"
 *                         updatedAt: "2025-05-13T15:37:35.011Z"
 *                         __v: 0
 *                         id: "6823673f22de12d1d3d9b0a1"
 *                         thumbnailUrl: "http://localhost:3000/assets/images/text-icon.png"
 *                     pagination:
 *                       currentPage: 1
 *                       totalPages: 1
 *                       totalItems: 4
 *                       itemsPerPage: 10
 *                       hasNextPage: false
 *                       hasPrevPage: false
 *                     filters: 
 *                       sortBy: "createdAt"
 *                       order: "desc"
 *               filteredInformationList:
 *                 summary: Filtered list of information entries (TEXT type only)
 *                 value:
 *                   success: true
 *                   code: "informationList"
 *                   message: "Information list retrieved successfully"
 *                   data:
 *                     items:
 *                       - _id: "6823673f22de12d1d3d9b0a1"
 *                         authorId: "6821e20f005c0032d4936c24"
 *                         title: "Techniques de respiration anti-stress"
 *                         descriptionInformation: "Découvrez les techniques de respiration pour réduire le stress au quotidien"
 *                         name: "respiration-anti-stress"
 *                         type: "TEXT"
 *                         content: "La technique de respiration 4-7-8 est une méthode simple mais efficace pour réduire le stress immédiat. Inspirez pendant 4 secondes, retenez votre souffle pendant 7 secondes, puis expirez lentement pendant 8 secondes. Répétez ce cycle 3 à 4 fois."
 *                         status: "DRAFT"
 *                         validatedAndPublishedAt: null
 *                         createdAt: "2025-05-13T15:37:35.011Z"
 *                         updatedAt: "2025-05-13T15:37:35.011Z"
 *                         __v: 0
 *                         id: "6823673f22de12d1d3d9b0a1"
 *                         thumbnailUrl: "http://localhost:3000/assets/images/text-icon.png"
 *                       - _id: "68235ce7081116d136ac8498"
 *                         authorId: "6821e20f005c0032d4936c24"
 *                         title: "Techniques de respiration anti-stress"
 *                         descriptionInformation: "Découvrez les techniques de respiration pour réduire le stress au quotidien"
 *                         name: "respiration-anti-stress"
 *                         type: "TEXT"
 *                         content: "La technique de respiration 4-7-8 est une méthode simple mais efficace pour réduire le stress immédiat. Inspirez pendant 4 secondes, retenez votre souffle pendant 7 secondes, puis expirez lentement pendant 8 secondes. Répétez ce cycle 3 à 4 fois."
 *                         status: "DRAFT"
 *                         validatedAndPublishedAt: null
 *                         createdAt: "2025-05-13T14:53:27.815Z"
 *                         updatedAt: "2025-05-13T14:53:27.815Z"
 *                         __v: 0
 *                         id: "68235ce7081116d136ac8498"
 *                         thumbnailUrl: "http://localhost:3000/assets/images/text-icon.png"
 *                     pagination:
 *                       currentPage: 1
 *                       totalPages: 1
 *                       totalItems: 2
 *                       itemsPerPage: 10
 *                       hasNextPage: false
 *                       hasPrevPage: false
 *                     filters:
 *                       type: "TEXT"
 *               emptyInformationList:
 *                 summary: No information entries found
 *                 value:
 *                   success: true
 *                   code: "noInformation"
 *                   message: "No information found"
 *                   data:
 *                     items: []
 *                     pagination:
 *                       currentPage: 1
 *                       totalPages: 0
 *                       totalItems: 0
 *                       itemsPerPage: 10
 *                       hasNextPage: false
 *                       hasPrevPage: false
 *                     filters:
 *                       type: "VIDEO"
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
 */
getInformationsRouter.get("/get-informations", auth, getAdminInformations)

export default getInformationsRouter
