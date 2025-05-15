import { createInformationValidationRules } from "@validator/information.validator.ts"
import { validationErrorHandler } from "@validator/validationError.validator.ts"
import { upload } from "@middlewares/multer/upload.middleware.ts"
import { auth } from "@api/src/middlewares/security/auth.middleware.ts"
import { createInformation } from "@controllers/index.ts"
import { Router } from "express"

const createInformationRouter = Router()

createInformationRouter.post(
	"/create",
	upload.single("file"),
	createInformationValidationRules,
	validationErrorHandler,
	auth,
	createInformation
)

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateInformationRequest:
 *       type: object
 *       required:
 *         - title
 *         - descriptionInformation
 *         - name
 *         - type
 *         - categoryId
 *       properties:
 *         title:
 *           type: string
 *           description: Title of the information
 *           example: "Techniques de respiration anti-stress"
 *         descriptionInformation:
 *           type: string
 *           description: Brief description of the information
 *           example: "Découvrez les techniques de respiration pour réduire le stress au quotidien"
 *         name:
 *           type: string
 *           description: Unique identifier/slug for the information
 *           example: "respiration-anti-stress"
 *         type:
 *           type: string
 *           enum: [TEXT, IMAGE, VIDEO]
 *           description: Type of information content
 *         categoryId:
 *           type: string
 *           description: MongoDB ObjectID of the category this information belongs to
 *           example: "6824ac779ca3a43fb48bbeac"
 *         status:
 *           type: string
 *           enum: [DRAFT, PUBLISHED]
 *           default: DRAFT
 *           description: Publication status of the information
 *         content:
 *           type: string
 *           description: Text content (required only for TEXT type)
 *           example: "La technique de respiration 4-7-8 est une méthode simple mais efficace pour réduire le stress immédiat..."
 *
 * /api/v1/informations/create:
 *   post:
 *     summary: Create a new information entry
 *     description: |
 *       Creates a new information entry with text content or media file (image, video).
 *       Each information must be assigned to a valid category.
 *       Authentication required.
 *     tags: [Informations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - descriptionInformation
 *               - name
 *               - type
 *               - categoryId
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the information
 *               descriptionInformation:
 *                 type: string
 *                 description: Brief description of the information
 *               name:
 *                 type: string
 *                 description: Unique identifier/slug for the information
 *               type:
 *                 type: string
 *                 enum: [TEXT, IMAGE, VIDEO]
 *                 description: Type of information content
 *               categoryId:
 *                 type: string
 *                 description: MongoDB ObjectID of the category this information belongs to
 *               status:
 *                 type: string
 *                 enum: [DRAFT, PUBLISHED]
 *                 default: DRAFT
 *                 description: Publication status of the information
 *               content:
 *                 type: string
 *                 description: Text content (required only for TEXT type)
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: File to upload (required only for IMAGE or VIDEO types)
 *     responses:
 *       201:
 *         description: Information successfully created
 *         content:
 *           application/json:
 *             examples:
 *               textInformation:
 *                 summary: Text information created
 *                 value:
 *                   success: true
 *                   code: "informationCreated"
 *                   message: "Information created successfully"
 *                   data:
 *                     information:
 *                       authorId: "6821e20f005c0032d4936c24"
 *                       title: "Techniques de respiration anti-stress"
 *                       descriptionInformation: "Découvrez les techniques de respiration pour réduire le stress au quotidien"
 *                       name: "respiration-anti-stress"
 *                       type: "TEXT"
 *                       categoryId: "6824ac779ca3a43fb48bbeac"
 *                       content: "La technique de respiration 4-7-8 est une méthode simple mais efficace pour réduire le stress immédiat. Inspirez pendant 4 secondes, retenez votre souffle pendant 7 secondes, puis expirez lentement pendant 8 secondes. Répétez ce cycle 3 à 4 fois."
 *                       status: "DRAFT"
 *                       validatedAndPublishedAt: null
 *                       _id: "6823673f22de12d1d3d9b0a1"
 *                       createdAt: "2025-05-13T15:37:35.011Z"
 *                       updatedAt: "2025-05-13T15:37:35.011Z"
 *                       __v: 0
 *                       id: "6823673f22de12d1d3d9b0a1"
 *               imageInformation:
 *                 summary: Image information created
 *                 value:
 *                   success: true
 *                   code: "informationCreated"
 *                   message: "Information created successfully"
 *                   data:
 *                     information:
 *                       authorId: "6821e20f005c0032d4936c24"
 *                       title: "Infographie sur la gestion du stress"
 *                       descriptionInformation: "Une infographie illustrant les principales techniques de gestion du stress"
 *                       name: "infographie-stress"
 *                       type: "IMAGE"
 *                       categoryId: "6824ac779ca3a43fb48bbeac"
 *                       status: "DRAFT"
 *                       validatedAndPublishedAt: null
 *                       fileId: "682367a522de12d1d3d9b0a4"
 *                       fileMetadata:
 *                         filename: "stress-infographic.jpg"
 *                         contentType: "image/jpeg"
 *                         size: 73276
 *                         uploadDate: "2025-05-13T15:39:17.829Z"
 *                       _id: "682367a522de12d1d3d9b0a6"
 *                       createdAt: "2025-05-13T15:39:17.836Z"
 *                       updatedAt: "2025-05-13T15:39:17.836Z"
 *                       __v: 0
 *                       id: "682367a522de12d1d3d9b0a6"
 *       400:
 *         description: Bad request - Validation failed
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
 *                       example: validationFailed
 *                     message:
 *                       type: string
 *                       example: Validation failed
 *                     location:
 *                       type: string
 *                       example: body
 *                     errors:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           field:
 *                             type: string
 *                           message:
 *                             type: string
 *                           location:
 *                             type: string
 *             examples:
 *               missingContent:
 *                 summary: Missing content for TEXT type
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "validationFailed"
 *                     message: "Validation failed"
 *                     location: "body"
 *                     errors:
 *                       - field: "content"
 *                         message: "The content is required"
 *                         location: "body"
 *                       - field: "content"
 *                         message: "The content must be a string"
 *                         location: "body"
 *                       - field: "content"
 *                         message: "The content cannot be empty"
 *                         location: "body"
 *               missingFile:
 *                 summary: Missing file for IMAGE type
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "validationFailed"
 *                     message: "Validation failed"
 *                     location: "body"
 *                     errors:
 *                       - message: "File is required for IMAGE information type"
 *                         location: "body"
 *               invalidCategory:
 *                 summary: Invalid category ID
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "validationFailed"
 *                     message: "Validation failed"
 *                     location: "body"
 *                     errors:
 *                       - field: "categoryId"
 *                         message: "Category with ID 6824ac779ca3a43fb48bbea1 does not exist"
 *                         location: "body"
 *               missingCategory:
 *                 summary: Missing category ID
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "validationFailed"
 *                     message: "Validation failed"
 *                     location: "body"
 *                     errors:
 *                       - field: "categoryId"
 *                         message: "The categoryId is required"
 *                         location: "body"
 *       401:
 *         description: Unauthorized - Authentication required
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
 *                       example: unauthorized
 *                     message:
 *                       type: string
 *                       example: Unauthorized access
 *             example:
 *               success: false
 *               error:
 *                 code: "unauthorized"
 *                 message: "Unauthorized access"
 *       403:
 *         description: Forbidden - Token expired or invalid
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
 *                       example: expiredToken
 *                     message:
 *                       type: string
 *                       example: Token expired
 *             example:
 *               success: false
 *               error:
 *                 code: "expiredToken"
 *                 message: "Token expired"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 */

export default createInformationRouter
