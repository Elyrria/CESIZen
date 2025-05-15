import { updateInformationValidationRules } from "@validator/information.validator.ts"
import { validationErrorHandler } from "@validator/validationError.validator.ts"
import { upload } from "@middlewares/multer/upload.middleware.ts"
import { auth } from "@middlewares/security/auth.middleware.ts"
import { updateInformation } from "@controllers/index.ts"
import { Router } from "express"

const updateInformationRouter = Router()
/**
 * @swagger
 * /api/v1/informations/update/{id}:
 *   put:
 *     summary: Update an existing information entry
 *     description: |
 *       Updates an information entry with new data. The user must be the author of the information or an administrator.
 *       Different rules apply depending on user roles:
 *       - Regular users can only update their own information entries and set status to DRAFT or PENDING
 *       - Administrators can update any information entry and set status to PUBLISHED
 *       
 *       For media types (IMAGE, VIDEO), a new file can be uploaded to replace the existing one.
 *       The category of the information can also be updated.
 *     tags: [Informations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectID of the information entry to update
 *         example: "68236226831d7acd21d5e898"
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Updated title for the information
 *                 example: "Info graphie 2 test avec 25 caractère"
 *               descriptionInformation:
 *                 type: string
 *                 description: Updated description (25-600 characters)
 *                 example: "Une infographie illustrant les principales techniques de gestion du stress"
 *               name:
 *                 type: string
 *                 description: Updated unique identifier/slug
 *                 example: "infographie-stress"
 *               categoryId:
 *                 type: string
 *                 description: MongoDB ObjectID of the new category for this information
 *                 example: "6824ac779ca3a43fb48bbeac"
 *               content:
 *                 type: string
 *                 description: Updated text content (only for TEXT type)
 *               status:
 *                 type: string
 *                 enum: [DRAFT, PENDING, PUBLISHED]
 *                 description: Updated publication status (PUBLISHED restricted to admins)
 *                 example: "DRAFT"
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: New file to upload (only for IMAGE or VIDEO types)
 *     responses:
 *       200:
 *         description: Information successfully updated
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
 *                   example: informationUpdated
 *                 message:
 *                   type: string
 *                   example: Information updated successfully
 *             example:
 *               success: true
 *               code: "informationUpdated"
 *               message: "Information updated successfully"
 *               data:
 *                 fileMetadata:
 *                   filename: "glass-sphere-7986102_640.jpg"
 *                   contentType: "image/jpeg"
 *                   size: 73276
 *                   uploadDate: "2025-05-13T15:15:50.907Z"
 *                 _id: "68236226831d7acd21d5e898"
 *                 authorId: "6821e20f005c0032d4936c24"
 *                 title: "Info graphie 2 test avec 25 caractère"
 *                 descriptionInformation: "Une infographie illustrant les principales techniques de gestion du stress"
 *                 name: "infographie-stress"
 *                 type: "IMAGE"
 *                 categoryId: "6824ac779ca3a43fb48bbeac"
 *                 status: "DRAFT"
 *                 validatedAndPublishedAt: null
 *                 fileId: "68236226831d7acd21d5e896"
 *                 createdAt: "2025-05-13T15:15:50.927Z"
 *                 updatedAt: "2025-05-14T11:47:19.058Z"
 *                 __v: 0
 *                 id: "68236226831d7acd21d5e898"
 *                 mediaUrl: "http://localhost:3000/api/v1/media/68236226831d7acd21d5e898"
 *       400:
 *         description: Validation error or invalid file type
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
 *               validationError:
 *                 summary: Validation error in input fields
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "validationFailed"
 *                     message: "Validation failed"
 *                     location: "body"
 *                     errors:
 *                       - field: "descriptionInformation"
 *                         message: "The descriptionInformation must contain between 25 and 600 characters"
 *                         location: "body"
 *               invalidFileType:
 *                 summary: Incompatible file type
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "invalidFileType"
 *                     message: "The file type is invalid for this operation"
 *                     location: "body"
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
 *       401:
 *         description: Authentication required
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
 *                 code: "unauthorized"
 *                 message: "Unauthorized access"
 *       403:
 *         description: Insufficient permissions
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
 *               insufficientAccess:
 *                 summary: User is not authorized to update this information
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "insufficientAccess"
 *                     message: "Insufficient access"
 *               statusRestriction:
 *                 summary: User cannot set the requested status
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "insufficientAccess"
 *                     message: "Insufficient access"
 *       404:
 *         description: Information not found
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
 *                 code: "informationNotFound"
 *                 message: "The requested information could not be found"
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
 *             examples:
 *               fileUploadFailed:
 *                 summary: Error uploading file
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "fileUploadFailed"
 *                     message: "Failed to upload the file"
 *               updateFailed:
 *                 summary: Information update failed
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "unableModifyInformation"
 *                     message: "Unable to modify the information with the provided data"
 *               serverError:
 *                 summary: Unexpected server error
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "unexpectedError"
 *                     message: "An unexpected error occurred"
 */

updateInformationRouter.put(
	"/update/:id",
    upload.single("file"),
	updateInformationValidationRules,
	validationErrorHandler,
	auth,
	updateInformation
)

export default updateInformationRouter
