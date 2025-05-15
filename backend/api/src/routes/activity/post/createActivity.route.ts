import { createActivityValidationRules } from "@validator/activity.validator.ts"
import { validationErrorHandler } from "@validator/validationError.validator.ts"
import { auth } from "@api/src/middlewares/security/auth.middleware.ts"
import { upload } from "@middlewares/multer/upload.middleware.ts"
import { createActivity } from "@controllers/index.ts"
import { Router } from "express"

const createActivityRouter = Router()
/**
 * @swagger
 * /api/v1/activities/create:
 *   post:
 *     summary: Create a new activity
 *     description: |
 *       Creates a new activity entry with support for text or video content types.
 *       Requires administrator access for creation.
 *
 *       For TEXT activities, content must be provided in the request body.
 *       For VIDEO activities, a file must be uploaded.
 *
 *       All activities must be associated with a valid category.
 *     tags: [Activities]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - descriptionActivity
 *               - type
 *               - categoryId
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the activity
 *                 example: "Cohérence cardiaque"
 *               descriptionActivity:
 *                 type: string
 *                 description: Description of the activity
 *                 example: "L'exercice de respiration proposé se base sur la cohérence cardiaque et s'articule autour de trois valeurs"
 *               type:
 *                 type: string
 *                 enum: [TEXT, VIDEO]
 *                 description: Type of activity content
 *               content:
 *                 type: string
 *                 description: Content for TEXT activities (required if type is TEXT)
 *                 example: "Pour pratiquer cet exercice, installez-vous confortablement dans un endroit calme."
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Video file (required if type is VIDEO)
 *               isActive:
 *                 type: boolean
 *                 description: Whether the activity is active (default is true)
 *                 default: true
 *               parameters:
 *                 type: object
 *                 description: Custom parameters for the activity
 *                 example: {
 *                   "breathingPatterns": [
 *                     {
 *                       "name": "748",
 *                       "description": "Inspiration : 7 secondes / Apnée : 4 secondes / Expiration : 8 secondes",
 *                       "inspiration": 7,
 *                       "retention": 4,
 *                       "expiration": 8
 *                     }
 *                   ],
 *                   "defaultPattern": "748",
 *                   "recommendedDuration": 300,
 *                   "benefits": [
 *                     "Réduction du stress et de l'anxiété",
 *                     "Amélioration de la concentration"
 *                   ],
 *                   "instructions": {
 *                     "before": "Trouvez un endroit calme",
 *                     "during": "Concentrez-vous sur votre respiration",
 *                     "after": "Observez comment vous vous sentez"
 *                   }
 *                 }
 *               categoryId:
 *                 type: string
 *                 description: ID of the category the activity belongs to
 *                 example: "6824ac779ca3a43fb48bbeac"
 *     responses:
 *       201:
 *         description: Activity created successfully
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
 *                   example: "activityCreated"
 *                 message:
 *                   type: string
 *                   example: "Activity created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     activity:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: "6825f53b3a0944127c37756a"
 *                         authorId:
 *                           type: string
 *                           example: "6821e20f005c0032d4936c24"
 *                         name:
 *                           type: string
 *                           example: "Cohérence cardiaque"
 *                         descriptionActivity:
 *                           type: string
 *                           example: "L'exercice de respiration proposé se base sur la cohérence cardiaque et s'articule autour de trois valeurs : Durée d'inspiration, Durée d'apnée et Durée d'expiration."
 *                         type:
 *                           type: string
 *                           enum: [TEXT, VIDEO]
 *                           example: "TEXT"
 *                         content:
 *                           type: string
 *                           example: "Pour pratiquer cet exercice, installez-vous confortablement dans un endroit calme."
 *                         isActive:
 *                           type: boolean
 *                           example: true
 *                         parameters:
 *                           type: object
 *                           example: {
 *                             "breathingPatterns": [
 *                               {
 *                                 "name": "748",
 *                                 "description": "Inspiration : 7 secondes / Apnée : 4 secondes / Expiration : 8 secondes",
 *                                 "inspiration": 7,
 *                                 "retention": 4,
 *                                 "expiration": 8
 *                               }
 *                             ],
 *                             "defaultPattern": "748",
 *                             "recommendedDuration": 300,
 *                             "benefits": [
 *                               "Réduction du stress et de l'anxiété",
 *                               "Amélioration de la concentration"
 *                             ],
 *                             "instructions": {
 *                               "before": "Trouvez un endroit calme",
 *                               "during": "Concentrez-vous sur votre respiration",
 *                               "after": "Observez comment vous vous sentez"
 *                             }
 *                           }
 *                         validatedAndPublishedAt:
 *                           type: string
 *                           format: date-time
 *                           nullable: true
 *                           example: null
 *                         categoryId:
 *                           type: array
 *                           items:
 *                             type: string
 *                           example: ["6824ac779ca3a43fb48bbeac"]
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-05-15T14:07:55.883Z"
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-05-15T14:07:55.883Z"
 *                         id:
 *                           type: string
 *                           example: "6825f53b3a0944127c37756a"
 *                         fileMetadata:
 *                           type: object
 *                           description: Only present for VIDEO type activities
 *                           example: {
 *                             "filename": "breathing_technique.mp4",
 *                             "contentType": "video/mp4",
 *                             "size": 15728640,
 *                             "uploadDate": "2025-05-15T14:07:55.883Z"
 *                           }
 *                         fileId:
 *                           type: string
 *                           description: Only present for VIDEO type activities
 *                           example: "6825f53b3a0944127c37756b"
 *             examples:
 *               textActivity:
 *                 summary: Successfully created TEXT activity
 *                 value:
 *                   success: true
 *                   code: "activityCreated"
 *                   message: "Activity created successfully"
 *                   data:
 *                     activity:
 *                       authorId: "6821e20f005c0032d4936c24"
 *                       name: "Cohérence cardiaque"
 *                       descriptionActivity: "L'exercice de respiration proposé se base sur la cohérence cardiaque et s'articule autour de trois valeurs : Durée d'inspiration, Durée d'apnée et Durée d'expiration. Cette technique aide à réguler le rythme cardiaque, diminuer le stress et améliorer la concentration."
 *                       type: "TEXT"
 *                       content: "Pour pratiquer cet exercice, installez-vous confortablement dans un endroit calme. Respirez en suivant le rythme indiqué et visualisez l'air circulant dans vos poumons. Maintenez le rythme pendant au moins 5 minutes pour de meilleurs résultats."
 *                       isActive: true
 *                       parameters:
 *                         breathingPatterns:
 *                           - name: "748"
 *                             description: "Inspiration : 7 secondes / Apnée : 4 secondes / Expiration : 8 secondes"
 *                             inspiration: 7
 *                             retention: 4
 *                             expiration: 8
 *                           - name: "55"
 *                             description: "Inspiration : 5 secondes / Apnée : 0 secondes / Expiration : 5 secondes"
 *                             inspiration: 5
 *                             retention: 0
 *                             expiration: 5
 *                           - name: "46"
 *                             description: "Inspiration : 4 secondes / Apnée : 0 secondes / Expiration : 6 secondes"
 *                             inspiration: 4
 *                             retention: 0
 *                             expiration: 6
 *                         defaultPattern: "748"
 *                         recommendedDuration: 300
 *                         benefits:
 *                           - "Réduction du stress et de l'anxiété"
 *                           - "Amélioration de la concentration"
 *                           - "Baisse de la pression artérielle"
 *                           - "Meilleure gestion des émotions"
 *                           - "Amélioration du sommeil"
 *                         instructions:
 *                           before: "Trouvez un endroit calme et adoptez une posture confortable, assise ou allongée"
 *                           during: "Concentrez-vous uniquement sur votre respiration en suivant le rythme affiché"
 *                           after: "Prenez un moment pour observer comment vous vous sentez après l'exercice"
 *                       validatedAndPublishedAt: null
 *                       categoryId: ["6824ac779ca3a43fb48bbeac"]
 *                       _id: "6825f53b3a0944127c37756a"
 *                       createdAt: "2025-05-15T14:07:55.883Z"
 *                       updatedAt: "2025-05-15T14:07:55.883Z"
 *                       __v: 0
 *                       id: "6825f53b3a0944127c37756a"
 *               videoActivity:
 *                 summary: Successfully created VIDEO activity
 *                 value:
 *                   success: true
 *                   code: "activityCreated"
 *                   message: "Activity created successfully"
 *                   data:
 *                     activity:
 *                       authorId: "6821e20f005c0032d4936c24"
 *                       name: "Exercice de respiration guidé"
 *                       descriptionActivity: "Une séance vidéo guidée pour pratiquer la respiration cohérente"
 *                       type: "VIDEO"
 *                       isActive: true
 *                       parameters:
 *                         recommendedDuration: 300
 *                         benefits:
 *                           - "Réduction du stress et de l'anxiété"
 *                           - "Amélioration de la concentration"
 *                         instructions:
 *                           before: "Trouvez un endroit calme et confortable"
 *                           during: "Suivez les instructions visuelles de la vidéo"
 *                           after: "Notez les changements dans votre état de relaxation"
 *                       fileMetadata:
 *                         filename: "breathing_exercise.mp4"
 *                         contentType: "video/mp4"
 *                         size: 15728640
 *                         uploadDate: "2025-05-15T14:09:32.456Z"
 *                       fileId: "6825f5bc3a0944127c37756c"
 *                       validatedAndPublishedAt: null
 *                       categoryId: ["6824ac779ca3a43fb48bbeac"]
 *                       _id: "6825f5bc3a0944127c37756d"
 *                       createdAt: "2025-05-15T14:09:32.456Z"
 *                       updatedAt: "2025-05-15T14:09:32.456Z"
 *                       __v: 0
 *                       id: "6825f5bc3a0944127c37756d"
 *       400:
 *         description: Bad request or validation error
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
 *                     location:
 *                       type: string
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
 *               contentMissing:
 *                 summary: Content missing for TEXT activity
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
 *               fileMissing:
 *                 summary: File missing for VIDEO activity
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "fileRequired"
 *                     message: "File is required for video content"
 *               invalidType:
 *                 summary: Invalid activity type
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "invalidActivityType"
 *                     message: "Invalid activity type"
 *               missingInfo:
 *                 summary: Missing required fields
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "missingInfo"
 *                     message: "Missing required information"
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
 *                 message: "Admin access is required for creating a new activity"
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
createActivityRouter.post(
	"/create",
	upload.single("file"),
	createActivityValidationRules,
	validationErrorHandler,
	auth,
	createActivity
)

export default createActivityRouter
