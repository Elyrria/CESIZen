import { auth } from "@middlewares/security/auth.middleware.ts"
import { getActivities } from "@controllers/index.ts"
import { Router } from "express"

const getActivitiesRouter = Router()
/**
 * @swagger
 * /api/v1/activities/get-activities:
 *   get:
 *     summary: Retrieve a list of all activities (admin only)
 *     description: |
 *       Fetches a paginated list of activity entries with optional filtering and sorting.
 *       This endpoint requires authentication and is restricted to administrators only.
 *       
 *       Unlike the public endpoints, this admin route returns all activities regardless of status,
 *       including inactive ones.
 *     tags: [Activities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [TEXT, VIDEO]
 *         description: Filter by activity type
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *         description: Filter by category ID
 *       - in: query
 *         name: authorId
 *         schema:
 *           type: string
 *         description: Filter by author ID
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in name and descriptionActivity
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
 *         description: Field to sort by (createdAt, name, type, isActive)
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
 *         description: Successfully retrieved activities list or empty list
 *         content:
 *           application/json:
 *             examples:
 *               activityList:
 *                 summary: List of activities
 *                 value:
 *                   success: true
 *                   code: "activityList"
 *                   message: "Activity list retrieved successfully"
 *                   data:
 *                     items:
 *                       - _id: "6825f53b3a0944127c37756a"
 *                         authorId: "6821e20f005c0032d4936c24"
 *                         name: "Cohérence cardiaque"
 *                         descriptionActivity: "L'exercice de respiration proposé se base sur la cohérence cardiaque et s'articule autour de trois valeurs : Durée d'inspiration, Durée d'apnée et Durée d'expiration. Cette technique aide à réguler le rythme cardiaque, diminuer le stress et améliorer la concentration."
 *                         type: "TEXT"
 *                         content: "Pour pratiquer cet exercice, installez-vous confortablement dans un endroit calme. Respirez en suivant le rythme indiqué et visualisez l'air circulant dans vos poumons. Maintenez le rythme pendant au moins 5 minutes pour de meilleurs résultats."
 *                         isActive: true
 *                         parameters:
 *                           breathingPatterns:
 *                             - name: "748"
 *                               description: "Inspiration : 7 secondes / Apnée : 4 secondes / Expiration : 8 secondes"
 *                               inspiration: 7
 *                               retention: 4
 *                               expiration: 8
 *                             - name: "55"
 *                               description: "Inspiration : 5 secondes / Apnée : 0 secondes / Expiration : 5 secondes"
 *                               inspiration: 5
 *                               retention: 0
 *                               expiration: 5
 *                             - name: "46"
 *                               description: "Inspiration : 4 secondes / Apnée : 0 secondes / Expiration : 6 secondes"
 *                               inspiration: 4
 *                               retention: 0
 *                               expiration: 6
 *                           defaultPattern: "748"
 *                           recommendedDuration: 300
 *                           benefits:
 *                             - "Réduction du stress et de l'anxiété"
 *                             - "Amélioration de la concentration"
 *                             - "Baisse de la pression artérielle"
 *                             - "Meilleure gestion des émotions"
 *                             - "Amélioration du sommeil"
 *                           instructions:
 *                             before: "Trouvez un endroit calme et adoptez une posture confortable, assise ou allongée"
 *                             during: "Concentrez-vous uniquement sur votre respiration en suivant le rythme affiché"
 *                             after: "Prenez un moment pour observer comment vous vous sentez après l'exercice"
 *                         validatedAndPublishedAt: null
 *                         categoryId: 
 *                           _id: "6824ac779ca3a43fb48bbeac"
 *                           name: "Techniques de respiration"
 *                           id: "6824ac779ca3a43fb48bbeac"
 *                         createdAt: "2025-05-15T14:07:55.883Z"
 *                         updatedAt: "2025-05-15T14:07:55.883Z"
 *                         __v: 0
 *                         id: "6825f53b3a0944127c37756a"
 *                       - _id: "6825f5bc3a0944127c37756d"
 *                         authorId: "6821e20f005c0032d4936c24"
 *                         name: "Exercice de respiration guidé"
 *                         descriptionActivity: "Une séance vidéo guidée pour pratiquer la respiration cohérente"
 *                         type: "VIDEO"
 *                         isActive: true
 *                         parameters:
 *                           recommendedDuration: 300
 *                           benefits:
 *                             - "Réduction du stress et de l'anxiété"
 *                             - "Amélioration de la concentration"
 *                           instructions:
 *                             before: "Trouvez un endroit calme et confortable"
 *                             during: "Suivez les instructions visuelles de la vidéo"
 *                             after: "Notez les changements dans votre état de relaxation"
 *                         fileMetadata:
 *                           filename: "breathing_exercise.mp4"
 *                           contentType: "video/mp4"
 *                           size: 15728640
 *                           uploadDate: "2025-05-15T14:09:32.456Z"
 *                         fileId: "6825f5bc3a0944127c37756c"
 *                         validatedAndPublishedAt: null
 *                         categoryId: 
 *                           _id: "6824ac779ca3a43fb48bbeac"
 *                           name: "Techniques de respiration"
 *                           id: "6824ac779ca3a43fb48bbeac"
 *                         createdAt: "2025-05-15T14:09:32.456Z"
 *                         updatedAt: "2025-05-15T14:09:32.456Z"
 *                         __v: 0
 *                         id: "6825f5bc3a0944127c37756d"
 *                     pagination:
 *                       currentPage: 1
 *                       totalPages: 1
 *                       totalItems: 2
 *                       itemsPerPage: 10
 *                       hasNextPage: false
 *                       hasPrevPage: false
 *                     filters: 
 *                       sortBy: "createdAt"
 *                       order: "desc"
 *               filteredActivities:
 *                 summary: Filtered list of activities (TEXT type only)
 *                 value:
 *                   success: true
 *                   code: "activityList"
 *                   message: "Activity list retrieved successfully"
 *                   data:
 *                     items:
 *                       - _id: "6825f53b3a0944127c37756a"
 *                         authorId: "6821e20f005c0032d4936c24"
 *                         name: "Cohérence cardiaque"
 *                         descriptionActivity: "L'exercice de respiration proposé se base sur la cohérence cardiaque et s'articule autour de trois valeurs : Durée d'inspiration, Durée d'apnée et Durée d'expiration. Cette technique aide à réguler le rythme cardiaque, diminuer le stress et améliorer la concentration."
 *                         type: "TEXT"
 *                         content: "Pour pratiquer cet exercice, installez-vous confortablement dans un endroit calme. Respirez en suivant le rythme indiqué et visualisez l'air circulant dans vos poumons. Maintenez le rythme pendant au moins 5 minutes pour de meilleurs résultats."
 *                         isActive: true
 *                         parameters:
 *                           breathingPatterns:
 *                             - name: "748"
 *                               description: "Inspiration : 7 secondes / Apnée : 4 secondes / Expiration : 8 secondes"
 *                               inspiration: 7
 *                               retention: 4
 *                               expiration: 8
 *                           defaultPattern: "748"
 *                           recommendedDuration: 300
 *                           benefits:
 *                             - "Réduction du stress et de l'anxiété"
 *                             - "Amélioration de la concentration"
 *                           instructions:
 *                             before: "Trouvez un endroit calme et adoptez une posture confortable"
 *                             during: "Concentrez-vous uniquement sur votre respiration"
 *                             after: "Prenez un moment pour observer comment vous vous sentez"
 *                         validatedAndPublishedAt: null
 *                         categoryId: 
 *                           _id: "6824ac779ca3a43fb48bbeac"
 *                           name: "Techniques de respiration"
 *                           id: "6824ac779ca3a43fb48bbeac"
 *                         createdAt: "2025-05-15T14:07:55.883Z"
 *                         updatedAt: "2025-05-15T14:07:55.883Z"
 *                         __v: 0
 *                         id: "6825f53b3a0944127c37756a"
 *                     pagination:
 *                       currentPage: 1
 *                       totalPages: 1
 *                       totalItems: 1
 *                       itemsPerPage: 10
 *                       hasNextPage: false
 *                       hasPrevPage: false
 *                     filters:
 *                       type: "TEXT"
 *               filteredByCategory:
 *                 summary: Filtered list of activities by category
 *                 value:
 *                   success: true
 *                   code: "activityList"
 *                   message: "Activity list retrieved successfully"
 *                   data:
 *                     items:
 *                       - _id: "6825f53b3a0944127c37756a"
 *                         authorId: "6821e20f005c0032d4936c24"
 *                         name: "Cohérence cardiaque"
 *                         descriptionActivity: "L'exercice de respiration proposé se base sur la cohérence cardiaque"
 *                         type: "TEXT"
 *                         content: "Pour pratiquer cet exercice, installez-vous confortablement dans un endroit calme."
 *                         isActive: true
 *                         parameters:
 *                           defaultPattern: "748"
 *                           recommendedDuration: 300
 *                         validatedAndPublishedAt: null
 *                         categoryId: 
 *                           _id: "6824ac779ca3a43fb48bbeac"
 *                           name: "Techniques de respiration"
 *                           id: "6824ac779ca3a43fb48bbeac"
 *                         createdAt: "2025-05-15T14:07:55.883Z"
 *                         updatedAt: "2025-05-15T14:07:55.883Z"
 *                         id: "6825f53b3a0944127c37756a"
 *                     pagination:
 *                       currentPage: 1
 *                       totalPages: 1
 *                       totalItems: 1
 *                       itemsPerPage: 10
 *                       hasNextPage: false
 *                       hasPrevPage: false
 *                     filters:
 *                       categoryId: "6824ac779ca3a43fb48bbeac"
 *               emptyActivitiesList:
 *                 summary: No activities found
 *                 value:
 *                   success: true
 *                   code: "noActivity"
 *                   message: "No activity found"
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
 *                 message: "Admin access is required for fetching all activities"
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
getActivitiesRouter.get("/get-activities", auth, getActivities)

export default getActivitiesRouter
