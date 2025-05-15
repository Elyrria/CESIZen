import { handleUnexpectedError, errorHandler } from "@errorHandler/errorHandler.ts"
import { uploadToGridFS, deleteFile } from "@services/gridfs.services.ts"
import { SUCCESS_CODE } from "@successHandler/configs.successHandler.ts"
import type { IInformationDocument } from "@api/types/information.d.ts"
import { ERROR_CODE } from "@errorHandler/configs.errorHandler.ts"
import { successHandler } from "@successHandler/successHandler.ts"
import { validateCategory } from "@utils/validateCategory.ts"
import { MEDIATYPE, STATUS } from "@configs/global.configs.ts"
import type { IAuthRequest } from "@api/types/request.d.ts"
import { Information, User } from "@models/index.ts"
import { ROLES } from "@configs/role.configs.ts"
import type { Response } from "express"
import { logger } from "@logs/logger.ts"
import { ObjectId } from "mongodb"
import chalk from "chalk"

/**
 * Controller for updating information entries.
 *
 * This controller handles the process of updating an existing information entry
 * with validation based on the user's role:
 * - Authors can update their own information and set status to DRAFT or PENDING
 * - Administrators can update any information and set status to PUBLISHED
 * - The category of an information can be changed
 *
 * @param {IAuthRequest} req - The request object containing the information ID and update data
 * @param {Response} res - The response object to send the update result
 * @returns {Promise<void>} - A promise that resolves when the update is complete
 */
export const updateInformation = async (req: IAuthRequest, res: Response): Promise<void> => {
	try {
		// Authentication check
		if (!req.auth?.userId) {
			errorHandler(res, ERROR_CODE.NO_CONDITIONS)
			return
		}
		const informationId = req.params.id
		const userId = req.auth.userId

		const user = await User.findById(userId).select("role")
		const isAdmin = user && user.role === ROLES.ADMIN

		logger.info(`Updating information ID: ${chalk.blue(informationId)}`)

		// Find the information to update
		const information = await Information.findById(informationId).populate("categoryId", "name")

		if (!information) {
			logger.warn(`Information with ID ${chalk.yellow(informationId)} not found`)
			errorHandler(res, ERROR_CODE.INFORMATION_NOT_FOUND)
			return
		}

		// Check permissions - only author or admin can update
		if (!isAdmin && information.authorId.toString() !== userId) {
			logger.warn(`User ${chalk.yellow(userId)} attempted to update information they don't own`)
			errorHandler(res, ERROR_CODE.INSUFFICIENT_ACCESS)
			return
		}

		// Prepare update data
		const updateData: Partial<IInformationDocument> = {}

		// Process basic fields that can be updated
		if (req.body.title) updateData.title = req.body.title
		if (req.body.descriptionInformation) updateData.descriptionInformation = req.body.descriptionInformation
		if (req.body.name) updateData.name = req.body.name

		// Process category update if provided
		if (req.body.categoryId) {
			// Use the validateCategory utility function
			const category = await validateCategory(
				req.body.categoryId,
				res,
				"Category",
				ERROR_CODE.INVALID_INFORMATION_TYPE
			)

			if (!category) return // If validation fails, response has already been handled

			// Category is valid, assign it to the update data
			updateData.categoryId = new ObjectId(String(req.body.categoryId))

			const oldCategoryName = information.categoryId
				? (information.categoryId as any).name
				: "unknown"
			logger.info(
				`Changing category from "${chalk.blue(oldCategoryName)}" to "${chalk.green(category.name)}"`
			)
		}

		// Process content for TEXT type
		if (information.type === MEDIATYPE[0] && req.body.content) {
			updateData.content = req.body.content
		}

		// Process status update with role-based restrictions
		if (req.body.status) {
			// Validate status value
			if (!STATUS.includes(req.body.status)) {
				logger.warn(`Invalid status value: ${chalk.yellow(req.body.status)}`)
				errorHandler(res, ERROR_CODE.INVALID_INFORMATION_TYPE)
				return
			}

			// Check permission for status change
			if (req.body.status === STATUS[2] && !isAdmin) {
				logger.warn(`Non-admin user attempted to set status to PUBLISHED`)
				errorHandler(res, ERROR_CODE.INSUFFICIENT_ACCESS)
				return
			}

			// Status is valid and user has permission
			updateData.status = req.body.status

			// If setting to PUBLISHED as admin, record validation timestamp and validator
			if (req.body.status === STATUS[2] && isAdmin) {
				updateData.validatedBy = new ObjectId(String(userId))
				updateData.validatedAndPublishedAt = new Date()
			}
		}

		// Handle file upload for media types (IMAGE, VIDEO)
		if ([MEDIATYPE[1], MEDIATYPE[2]].includes(information.type) && req.file) {
			try {
				// Validate file type matches information type
				const fileType = req.file.mimetype.split("/")[0].toUpperCase()

				if (
					(information.type === MEDIATYPE[2] && fileType !== MEDIATYPE[2]) ||
					(information.type === MEDIATYPE[1] && fileType !== MEDIATYPE[1])
				) {
					logger.warn(`File type mismatch: expected ${information.type}, got ${fileType}`)
					errorHandler(res, ERROR_CODE.INVALID_FILE_TYPE)
					return
				}

				// Upload new file to GridFS
				const fileId = await uploadToGridFS(
					req.file.buffer,
					req.file.originalname,
					req.file.mimetype,
					{ informationId, userId }
				)

				// Get old fileId for later deletion
				const oldFileId = information.fileId

				// Update file information
				updateData.fileId = fileId
				updateData.fileMetadata = {
					filename: req.file.originalname,
					contentType: req.file.mimetype,
					size: req.file.size,
					uploadDate: new Date(),
				}

				// Delete old file after successful upload
				if (oldFileId) {
					try {
						await deleteFile(oldFileId)
						logger.info(
							`Successfully deleted old file: ${chalk.green(oldFileId.toString())}`
						)
					} catch (deleteError) {
						// Log error but continue with update
						logger.error(
							`Failed to delete old file: ${chalk.red(oldFileId.toString())}`
						)
					}
				}
			} catch (uploadError) {
				logger.error(`File upload failed: ${(uploadError as Error).message}`)
				errorHandler(res, ERROR_CODE.FILE_UPLOAD_FAILED)
				return
			}
		}

		// Update the information - only if there are fields to update
		if (Object.keys(updateData).length === 0) {
			logger.warn(`No fields to update for information: ${chalk.yellow(informationId)}`)
			errorHandler(res, ERROR_CODE.NO_FIELDS)
			return
		}

		const updatedInformation = await Information.findByIdAndUpdate(
			informationId,
			{ $set: updateData },
			{ new: true, runValidators: true }
		).populate("categoryId", "name") // Populate category to include it in response

		if (!updatedInformation) {
			logger.error(`Failed to update information: ${chalk.red(informationId)}`)
			errorHandler(res, ERROR_CODE.UNABLE_MODIFY_INFORMATION)
			return
		}

		logger.info(`Successfully updated information: ${chalk.green(informationId)}`)

		// Transform the updated information to include media URLs if needed
		const baseUrl = `${req.protocol}://${req.get("host")}`
		const transformedInfo = updatedInformation.toObject()

		// Add media URL if it's an IMAGE or VIDEO
		if ([MEDIATYPE[1], MEDIATYPE[2]].includes(updatedInformation.type) && updatedInformation.fileId) {
			transformedInfo.mediaUrl = `${baseUrl}/api/v1/informations/media/${updatedInformation._id}`

			// Add thumbnail URL for videos
			if (updatedInformation.type === MEDIATYPE[1]) {
				transformedInfo.thumbnailUrl = `${baseUrl}/assets/images/video-thumbnail.png`
			}
		} else if (updatedInformation.type === MEDIATYPE[0]) {
			// Default thumbnail for text
			transformedInfo.thumbnailUrl = `${baseUrl}/assets/images/text-icon.png`
		}

		// Send successful response
		successHandler(res, SUCCESS_CODE.INFORMATION_UPDATED, transformedInfo)
	} catch (error: unknown) {
		logger.error(`Error updating information: ${(error as Error).message}`)
		handleUnexpectedError(res, error as Error)
	}
}
