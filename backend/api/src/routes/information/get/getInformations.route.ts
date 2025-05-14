import { getInformations } from "@controllers/index.ts"
import { Router } from "express"

const getInformationsRouter = Router()
/**
 * @swagger
 * components:
 *   schemas:
 *     TransformedInformation:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: MongoDB ObjectID of the information
 *         authorId:
 *           type: string
 *           description: MongoDB ObjectID of the author
 *         title:
 *           type: string
 *           description: Title of the information
 *         descriptionInformation:
 *           type: string
 *           description: Brief description of the information
 *         name:
 *           type: string
 *           description: Unique identifier/slug for the information
 *         type:
 *           type: string
 *           enum: [TEXT, IMAGE, VIDEO]
 *           description: Type of information content
 *         content:
 *           type: string
 *           description: Text content (only present for TEXT type)
 *         status:
 *           type: string
 *           enum: [DRAFT, PUBLISHED]
 *           description: Publication status of the information
 *         validatedAndPublishedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Date when the information was published (null for drafts)
 *         fileId:
 *           type: string
 *           description: MongoDB ObjectID of the uploaded file (only present for IMAGE or VIDEO types)
 *         fileMetadata:
 *           $ref: '#/components/schemas/FileMetadata'
 *           description: Metadata about the uploaded file (only present for IMAGE or VIDEO types)
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
 *           description: MongoDB ObjectID of the information
 *         mediaUrl:
 *           type: string
 *           description: URL to access the media file (only present for IMAGE or VIDEO types)
 *         thumbnailUrl:
 *           type: string
 *           description: URL to a thumbnail image (present for all types)
 *
 *     PaginationInfo:
 *       type: object
 *       properties:
 *         currentPage:
 *           type: number
 *           description: Current page number
 *         totalPages:
 *           type: number
 *           description: Total number of pages
 *         totalItems:
 *           type: number
 *           description: Total number of items matching the query
 *         itemsPerPage:
 *           type: number
 *           description: Number of items per page
 *         hasNextPage:
 *           type: boolean
 *           description: Whether there is a next page
 *         hasPrevPage:
 *           type: boolean
 *           description: Whether there is a previous page
 *
 *     GetInformationsResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         code:
 *           type: string
 *           example: informationList
 *         message:
 *           type: string
 *           example: Information list retrieved successfully
 *         data:
 *           type: object
 *           properties:
 *             items:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TransformedInformation'
 *             pagination:
 *               $ref: '#/components/schemas/PaginationInfo'
 *             filters:
 *               type: object
 *               description: Filter parameters that were applied to the query
 *
 *     NoInformationsResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         code:
 *           type: string
 *           example: noInformation
 *         message:
 *           type: string
 *           example: No information found
 *         data:
 *           type: object
 *           properties:
 *             items:
 *               type: array
 *               items: {}
 *               description: Empty array when no items are found
 *             pagination:
 *               $ref: '#/components/schemas/PaginationInfo'
 *             filters:
 *               type: object
 *               description: Filter parameters that were applied to the query
 *
 * /api/v1/informations/get-informations:
 *   get:
 *     summary: Retrieve a list of information entries
 *     description: Fetches a paginated list of information entries with optional filtering and sorting
 *     tags: [Informations]
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
 *           enum: [DRAFT, PUBLISHED]
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
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 */
getInformationsRouter.get("/get-informations", getInformations)

export default getInformationsRouter
