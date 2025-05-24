import { auth } from "@middlewares/security/auth.middleware.ts"
import { upload } from "@middlewares/multer/upload.middleware.ts"  // AJOUT MANQUANT
import { updateActivity } from "@controllers/index.ts"
import { Router } from "express"

const updateActivityRouter = Router()
/**
 * @swagger
 * /api/v1/activities/update/{id}:
 *   put:
 *     summary: Update an existing activity (admin only)
 *     description: |
 *       Updates an existing activity entry with the provided data.
 *       This endpoint requires authentication and is restricted to administrators only.
 *       
 *       Features:
 *       - Updates basic fields like name, descriptionActivity
 *       - Updates content for TEXT type activities
 *       - Handles file uploads for VIDEO type activities
 *       - Manages category changes with validation
 *       - Updates active status and validation information
 *     tags: [Activities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the activity to update
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Updated name of the activity
 *               descriptionActivity:
 *                 type: string
 *                 description: Updated description of the activity
 *               content:
 *                 type: string
 *                 description: Updated content for TEXT type activities
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: New video file for VIDEO type activities
 *               isActive:
 *                 type: boolean
 *                 description: Whether the activity should be active or not
 *               parameters:
 *                 type: object
 *                 description: Updated parameters for the activity
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
 *                 description: ID of the new category for the activity
 *     responses:
 *       200:
 *         description: Activity updated successfully
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
 *                   example: "activityUpdated"
 *                 message:
 *                   type: string
 *                   example: "Activity updated successfully"
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
 *                           type: object
 *                           properties:
 *                             _id:
 *                               type: string
 *                             email:
 *                               type: string
 *                             name:
 *                               type: string
 *                             id:
 *                               type: string
 *                           example:
 *                             _id: "6821e20f005c0032d4936c24"
 *                             email: "quentindumon352a@gmail.com"
 *                             name: "0929221efdb1616d5cd9556773fb0469:5ac73c4df59e825e4e23effb0175c754"
 *                             id: "6821e20f005c0032d4936c24"
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
 *                           example: false
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
 *                             type: object
 *                             properties:
 *                               _id:
 *                                 type: string
 *                               name:
 *                                 type: string
 *                               id:
 *                                 type: string
 *                           example: [
 *                             {
 *                               _id: "6824ac779ca3a43fb48bbeac",
 *                               name: "Techniques de respiration",
 *                               id: "6824ac779ca3a43fb48bbeac"
 *                             }
 *                           ]
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-05-15T14:07:55.883Z"
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-05-15T15:55:30.753Z"
 *                         __v:
 *                           type: integer
 *                           example: 0
 *                         id:
 *                           type: string
 *                           example: "6825f53b3a0944127c37756a"
 *                         thumbnailUrl:
 *                           type: string
 *                           example: "http://localhost:3000/assets/images/text-icon.png"
 *                         mediaUrl:
 *                           type: string
 *                           description: Only present for VIDEO type activities
 *                           example: "http://localhost:3000/api/v1/activities/media/6825f5bc3a0944127c37756d"
 *             examples:
 *               textActivityUpdate:
 *                 summary: Text activity update example
 *                 value:
 *                   success: true
 *                   code: "activityUpdated"
 *                   message: "Activity updated successfully"
 *                   data:
 *                     activity:
 *                       _id: "6825f53b3a0944127c37756a"
 *                       authorId:
 *                         _id: "6821e20f005c0032d4936c24"
 *                         email: "quentindumon352a@gmail.com"
 *                         name: "0929221efdb1616d5cd9556773fb0469:5ac73c4df59e825e4e23effb0175c754"
 *                         id: "6821e20f005c0032d4936c24"
 *                       name: "Cohérence cardiaque"
 *                       descriptionActivity: "L'exercice de respiration proposé se base sur la cohérence cardiaque et s'articule autour de trois valeurs : Durée d'inspiration, Durée d'apnée et Durée d'expiration. Cette technique aide à réguler le rythme cardiaque, diminuer le stress et améliorer la concentration."
 *                       type: "TEXT"
 *                       content: "Pour pratiquer cet exercice, installez-vous confortablement dans un endroit calme. Respirez en suivant le rythme indiqué et visualisez l'air circulant dans vos poumons. Maintenez le rythme pendant au moins 5 minutes pour de meilleurs résultats."
 *                       isActive: false
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
 *                       categoryId:
 *                         - _id: "6824ac779ca3a43fb48bbeac"
 *                           name: "Techniques de respiration"
 *                           id: "6824ac779ca3a43fb48bbeac"
 *                       createdAt: "2025-05-15T14:07:55.883Z"
 *                       updatedAt: "2025-05-15T15:55:30.753Z"
 *                       __v: 0
 *                       id: "6825f53b3a0944127c37756a"
 *                       thumbnailUrl: "http://localhost:3000/assets/images/text-icon.png"
 *               videoActivityUpdate:
 *                 summary: Video activity update example
 *                 value:
 *                   success: true
 *                   code: "activityUpdated"
 *                   message: "Activity updated successfully"
 *                   data:
 *                     activity:
 *                       _id: "6825f5bc3a0944127c37756d"
 *                       authorId:
 *                         _id: "6821e20f005c0032d4936c24"
 *                         email: "quentindumon352a@gmail.com"
 *                         name: "0929221efdb1616d5cd9556773fb0469:5ac73c4df59e825e4e23effb0175c754"
 *                         id: "6821e20f005c0032d4936c24"
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
 *                         uploadDate: "2025-05-15T16:10:45.678Z"
 *                       fileId: "6825f5bc3a0944127c37756c"
 *                       validatedAndPublishedAt: "2025-05-15T16:10:45.678Z"
 *                       validatedBy:
 *                         _id: "6821e20f005c0032d4936c24"
 *                         email: "quentindumon352a@gmail.com"
 *                         name: "0929221efdb1616d5cd9556773fb0469:5ac73c4df59e825e4e23effb0175c754"
 *                         id: "6821e20f005c0032d4936c24"
 *                       categoryId:
 *                         - _id: "6824ac779ca3a43fb48bbeac"
 *                           name: "Techniques de respiration"
 *                           id: "6824ac779ca3a43fb48bbeac"
 *                       createdAt: "2025-05-15T14:09:32.456Z"
 *                       updatedAt: "2025-05-15T16:10:45.678Z"
 *                       __v: 0
 *                       id: "6825f5bc3a0944127c37756d"
 *                       mediaUrl: "http://localhost:3000/api/v1/activities/media/6825f5bc3a0944127c37756d"
 *                       thumbnailUrl: "http://localhost:3000/assets/images/video-thumbnail.png"
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
 *             examples:
 *               invalidFileType:
 *                 summary: Invalid file type for activity
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "invalidFileType"
 *                     message: "Invalid file type"
 *               noFieldsToUpdate:
 *                 summary: No fields provided for update
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "noFields"
 *                     message: "No fields to update"
 *               fileUploadFailed:
 *                 summary: File upload failed
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "fileUploadFailed"
 *                     message: "File upload failed"
 *               invalidParameters:
 *                 summary: Invalid parameters format
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "invalidActivityType"
 *                     message: "Invalid parameters format"
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
 *                 message: "Admin access is required for updating an activity"
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

updateActivityRouter.put("/update/:id", upload.single("file"), auth, updateActivity)

export default updateActivityRouter