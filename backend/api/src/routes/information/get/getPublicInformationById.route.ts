
import { getPublicInformations, getPublicInformationById } from "@controllers/index.ts"
import { Router } from "express"

const getPublicInformationsByIdRouter = Router()

/**
 * @swagger
 * /api/v1/informations/get-public-information/{id}:
 *   get:
 *     summary: Retrieve a specific published information entry by ID (public access)
 *     description: |
 *       Fetches a single information entry by its ID that has a PUBLISHED status only.
 *       This endpoint is publicly accessible without authentication and is intended for
 *       retrieving specific content that has been approved for public viewing.
 *       
 *       Returns no information found if the entry doesn't exist or is not published.
 *     tags: [Informations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: MongoDB ObjectId of the information entry
 *         example: "683067d6b3fc2331deba0879"
 *     responses:
 *       200:
 *         description: Successfully retrieved published information entry or no information found
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/GetInformationByIdResponse'
 *                 - $ref: '#/components/schemas/NoInformationFoundResponse'
 *             examples:
 *               videoInformation:
 *                 summary: Video information entry
 *                 value:
 *                   success: true
 *                   code: "informationFound"
 *                   message: "Information retrieved successfully"
 *                   data:
 *                     item:
 *                       fileMetadata:
 *                         filename: "pause.mp4"
 *                         contentType: "video/mp4"
 *                         size: 29215139
 *                         uploadDate: "2025-05-23T12:19:34.555Z"
 *                       _id: "683067d6b3fc2331deba0879"
 *                       authorId: "68220c41957e5a0aa8e3e9f9"
 *                       title: "Micro-pause énergisante de 3 minutes"
 *                       descriptionInformation: "Séquence d'exercices courts à faire au bureau pour recharger ses batteries et réduire les tensions"
 *                       name: "micro-pause-energisante"
 *                       type: "VIDEO"
 *                       status: "PUBLISHED"
 *                       validatedAndPublishedAt: "2025-05-23T12:19:34.577Z"
 *                       fileId: "683067d5b3fc2331deba0808"
 *                       categoryId:
 *                         - _id: "6825aa073bb6f2b08827c2e7"
 *                           name: "Gestion du stress au travail"
 *                           id: "6825aa073bb6f2b08827c2e7"
 *                       createdAt: "2025-05-23T12:19:34.577Z"
 *                       updatedAt: "2025-05-23T12:19:34.577Z"
 *                       __v: 0
 *                       id: "683067d6b3fc2331deba0879"
 *                       mediaUrl: "http://localhost:3000/api/v1/informations/media/683067d6b3fc2331deba0879"
 *                       thumbnailUrl: "http://localhost:3000/assets/images/video-thumbnail.png"
 *               imageInformation:
 *                 summary: Image information entry
 *                 value:
 *                   success: true
 *                   code: "informationFound"
 *                   message: "Information retrieved successfully"
 *                   data:
 *                     item:
 *                       fileMetadata:
 *                         filename: "posture_yoga.jpg"
 *                         contentType: "image/jpeg"
 *                         size: 2818741
 *                         uploadDate: "2025-05-23T11:52:16.989Z"
 *                       _id: "68306170de3bfd2135599786"
 *                       authorId: "68220c41957e5a0aa8e3e9f9"
 *                       title: "Guide visuel : Positions de yoga relaxantes"
 *                       descriptionInformation: "Illustration détaillée de 8 positions de yoga faciles pour débutants, idéales pour la relaxation"
 *                       name: "yoga-positions-relaxation"
 *                       type: "IMAGE"
 *                       status: "PUBLISHED"
 *                       validatedAndPublishedAt: "2025-05-23T11:52:16.992Z"
 *                       fileId: "68306170de3bfd213559977a"
 *                       categoryId:
 *                         - _id: "68303606a7530f7be1b74e33"
 *                           name: "Techniques de relaxation"
 *                           id: "68303606a7530f7be1b74e33"
 *                       createdAt: "2025-05-23T11:52:16.992Z"
 *                       updatedAt: "2025-05-23T11:52:16.992Z"
 *                       __v: 0
 *                       id: "68306170de3bfd2135599786"
 *                       mediaUrl: "http://localhost:3000/api/v1/informations/media/68306170de3bfd2135599786"
 *               textInformation:
 *                 summary: Text information entry
 *                 value:
 *                   success: true
 *                   code: "informationFound"
 *                   message: "Information retrieved successfully"
 *                   data:
 *                     item:
 *                       _id: "68303752a7530f7be1b74e51"
 *                       authorId: "68220c41957e5a0aa8e3e9f9"
 *                       title: "Comprendre les troubles anxieux généralisés"
 *                       descriptionInformation: "Information complète sur les troubles anxieux généralisés : symptômes, causes et options de traitement"
 *                       name: "troubles-anxieux-generalises"
 *                       type: "TEXT"
 *                       content: "Le trouble anxieux généralisé (TAG) touche environ 5% de la population et se caractérise par une inquiétude excessive et persistante concernant diverses situations de la vie quotidienne..."
 *                       status: "PUBLISHED"
 *                       validatedAndPublishedAt: "2025-05-23T09:36:50.888Z"
 *                       categoryId:
 *                         - _id: "68303614a7530f7be1b74e36"
 *                           name: "Santé mentale"
 *                           id: "68303614a7530f7be1b74e36"
 *                       createdAt: "2025-05-23T08:52:34.420Z"
 *                       updatedAt: "2025-05-23T09:36:50.889Z"
 *                       __v: 0
 *                       validatedBy: "68220c41957e5a0aa8e3e9f9"
 *                       id: "68303752a7530f7be1b74e51"
 *                       thumbnailUrl: "http://localhost:3000/assets/images/text-icon.png"
 *               informationNotFound:
 *                 summary: Information not found or not published
 *                 value:
 *                   success: true
 *                   code: "noInformation"
 *                   message: "No information found"
 *                   data:
 *                     item: null
 *                     message: "Information not found or not published"
 *               invalidIdFormat:
 *                 summary: Invalid ID format provided
 *                 value:
 *                   success: true
 *                   code: "noInformation"
 *                   message: "No information found"
 *                   data:
 *                     item: null
 *                     message: "Invalid information ID format"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 *             example:
 *               success: false
 *               error:
 *                 code: "serverError"
 *                 message: "An unexpected error occurred"
 */

getPublicInformationsByIdRouter.get("/get-public-information/:id", getPublicInformationById)

export default getPublicInformationsByIdRouter