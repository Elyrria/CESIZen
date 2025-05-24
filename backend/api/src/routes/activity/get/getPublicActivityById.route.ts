import { getPublicActivityById } from "@controllers/index.ts"
import { Router } from "express"

const getPublicActivityByIdRouter = Router()
/**
 * @swagger
 * /api/v1/activities/get-public-activity/{id}:
 *   get:
 *     summary: Retrieve a specific public activity by ID
 *     description: |
 *       Fetches a single active activity entry by its ID.
 *       This endpoint is publicly accessible without authentication and is intended for
 *       retrieving content that is ready for public use.
 *       
 *       Only returns activities where isActive is true.
 *     tags: [Activities]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the activity to retrieve
 *     responses:
 *       200:
 *         description: Public activity retrieved successfully
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
 *                   example: "activityList"
 *                 message:
 *                   type: string
 *                   example: "Activity list retrieved successfully"
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
 *                             ]
 *                           }
 *                         categoryId:
 *                           type: object
 *                           properties:
 *                             _id:
 *                               type: string
 *                             name:
 *                               type: string
 *                             id:
 *                               type: string
 *                           example:
 *                             _id: "6824ac779ca3a43fb48bbeac"
 *                             name: "Techniques de respiration"
 *                             id: "6824ac779ca3a43fb48bbeac"
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
 *                         mediaUrl:
 *                           type: string
 *                           description: Only present for VIDEO type activities
 *                           example: "http://localhost:3000/api/v1/activities/media/6825f53b3a0944127c37756a"
 *                         thumbnailUrl:
 *                           type: string
 *                           example: "http://localhost:3000/assets/images/text-icon.png"
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-05-15T14:07:55.883Z"
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-05-15T14:07:55.883Z"
 *                         __v:
 *                           type: integer
 *                           example: 0
 *                         id:
 *                           type: string
 *                           example: "6825f53b3a0944127c37756a"
 *             examples:
 *               textActivity:
 *                 summary: TEXT activity retrieved successfully
 *                 value:
 *                   success: true
 *                   code: "activityList"
 *                   message: "Activity list retrieved successfully"
 *                   data:
 *                     activity:
 *                       _id: "6825f53b3a0944127c37756a"
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
 *                         defaultPattern: "748"
 *                         recommendedDuration: 300
 *                         benefits:
 *                           - "Réduction du stress et de l'anxiété"
 *                           - "Amélioration de la concentration"
 *                       categoryId:
 *                         _id: "6824ac779ca3a43fb48bbeac"
 *                         name: "Techniques de respiration"
 *                         id: "6824ac779ca3a43fb48bbeac"
 *                       createdAt: "2025-05-15T14:07:55.883Z"
 *                       updatedAt: "2025-05-15T14:07:55.883Z"
 *                       __v: 0
 *                       id: "6825f53b3a0944127c37756a"
 *                       thumbnailUrl: "http://localhost:3000/assets/images/text-icon.png"
 *               videoActivity:
 *                 summary: VIDEO activity retrieved successfully
 *                 value:
 *                   success: true
 *                   code: "activityFound"
 *                   message: "Activity retrieved successfully"
 *                   data:
 *                     activity:
 *                       _id: "6825f5bc3a0944127c37756d"
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
 *                       fileMetadata:
 *                         filename: "breathing_exercise.mp4"
 *                         contentType: "video/mp4"
 *                         size: 15728640
 *                         uploadDate: "2025-05-15T14:09:32.456Z"
 *                       fileId: "6825f5bc3a0944127c37756c"
 *                       categoryId:
 *                         _id: "6824ac779ca3a43fb48bbeac"
 *                         name: "Techniques de respiration"
 *                         id: "6824ac779ca3a43fb48bbeac"
 *                       createdAt: "2025-05-15T14:09:32.456Z"
 *                       updatedAt: "2025-05-15T14:09:32.456Z"
 *                       __v: 0
 *                       id: "6825f5bc3a0944127c37756d"
 *                       mediaUrl: "http://localhost:3000/api/v1/activities/media/6825f5bc3a0944127c37756d"
 *                       thumbnailUrl: "http://localhost:3000/assets/images/video-thumbnail.png"
 *       400:
 *         description: Invalid activity ID
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
 *                 code: "invalidId"
 *                 message: "Invalid activity ID format"
 *       404:
 *         description: Activity not found or not active
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
 *                 message: "Activity not found or not available"
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
getPublicActivityByIdRouter.get("/get-public-activity/:id", getPublicActivityById)

export default getPublicActivityByIdRouter